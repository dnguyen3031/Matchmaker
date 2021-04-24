import time

from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

from mongodb import *
from bson import ObjectId
from ELO import *


def make_matches(game):
    for lobby in game["queue"]:
        # print("lobby: ")
        # print(lobby)
        matched_lobby = find_suitable(game, lobby)
        # print("matched_lobby: ")
        # print(matched_lobby)
        if matched_lobby is not None:
            merged_lobby = merge_matches(game, lobby, matched_lobby)
            if check_sizes(lobby, matched_lobby, game["num_players"]) == 0:
                # send lobby to in progress
                # print("lobby to add")
                full_lobby = Lobby(merged_lobby)
                # print("full_lobby", full_lobby)
                assignteams(full_lobby)
                # print("full_lobby", full_lobby)
                assign_discord(full_lobby)
                add_team_info(full_lobby)
                full_lobby["time_elapsed"] = 0
                full_lobby.save()
                set_player_lobby(full_lobby)

            else:
                # num players too small, sent back to queue
                game["queue"].append(merged_lobby)
            updated_game = Game(game)  # create updated game
            updated_game["_id"] = ObjectId(game["_id"])  # mongoDB doesn't like string IDs
            updated_game.patch()  # create updated game object and update db


def get_adv_elo(team, game_id):
    players = 0
    elo = 0
    game = Game({"_id": game_id})
    game.reload()
    for group in team:
        for player in group["players"].keys():
            players += 1
            user = User({"_id": player})
            user.reload()
            elo += user["games_table"][game["game_name"]]["game_score"]
    return int(elo / players)


def add_team_info(full_lobby):
    num_teams = len(full_lobby["teams"])
    team_info = []
    for i in range(num_teams):
        team_info += [{"votes": [0]*num_teams}]
        team_info[i]["adv_elo"] = get_adv_elo(full_lobby["teams"][i], full_lobby["game_id"])
    full_lobby["team_info"] = team_info


def get_next_discord():
    discords = Discord().find_all()
    nextOpen = None
    i = 0
    while not nextOpen:
        if i >= len(discords):
            nextOpen = {"room_name": "all rooms taken"}
        elif discords[i]["status"] == "open":
            nextOpen = discords[i]
        i += 1

    if nextOpen != {"room_name": "all rooms taken"}:
        # discordToUpdate = nextOpen
        nextOpen["_id"] = ObjectId(nextOpen["_id"])
        nextOpen["status"] = "taken"
        newDiscord = Discord(nextOpen)
        newDiscord.patch()

    return {"room_name": nextOpen["room_name"]}


def assign_discord(full_lobby):
    # print("assiging discord")
    # discord =
    # print(discord)
    full_lobby["discord"] = get_next_discord()["room_name"]
    # print("discord: ", full_lobby["discord"])


def assignteams(full_lobby):
    # print("assiging teams")
    game = Game({"_id": full_lobby["game_id"]})
    game.reload()
    team1, team2 = find_best_teams(full_lobby["groups"])
    full_lobby["teams"] = [team1, team2]
    # print("teams", team1, " ", team2)


def find_best_teams(groups):
    team1, team2 = {"size": 0, "groups": []}, {"size": 0, "groups": []}
    unused_groups = [] + groups
    # print("unused_groups ", unused_groups)
    for i in range(len(groups)):
        if team1["size"] > team2["size"]:
            temp = largest_group(unused_groups)
            # print("temp: ", temp)
            team2["groups"] += [temp]
            team2["size"] += len(temp["players"].keys())
        else:
            temp = largest_group(unused_groups)
            # print("temp: ", temp)
            team1["groups"] += [temp]
            team1["size"] += len(temp["players"].keys())
    # print("team1 ", team1)
    # print("team2 ", team2)
    return team1["groups"], team2["groups"]


def largest_group(unused_groups):
    largest_group = 0
    for i in range(len(unused_groups)):
        if len(unused_groups[i]["players"].keys()) > len(unused_groups[largest_group]["players"].keys()):
            largest_group = i
    return unused_groups.pop(largest_group)


def set_player_lobby(lobby):
    lobby.reload()
    for group in lobby["groups"]:
        for id in group["players"].keys():
            player = User({"_id": id})
            player.reload()
            player["lobby"] = lobby["_id"]
            player["_id"] = ObjectId(id)
            player.patch()


def merge_matches(game, lobby, matched_lobby):
    # takes the two lobbies, removes them from game and returns a merged lobby
    # TODO: record avg elo for each groop for team-making purposes
    merged_elo = (lobby["avg_elo"] * lobby["num_players"] + matched_lobby["avg_elo"] * matched_lobby["num_players"]) / (
            lobby["num_players"] + matched_lobby["num_players"])
    merged_groups = lobby["groups"] + matched_lobby["groups"]
    merged_num_players = lobby["num_players"] + matched_lobby["num_players"]
    larger_window_size = max(lobby["window_size"], matched_lobby["window_size"])
    merged_lobby = {
        "avg_elo": merged_elo,
        "game_id": lobby["game_id"],
        "groups": merged_groups,
        "num_players": merged_num_players,
        "window_size": larger_window_size,
    }
    game["queue"].remove(lobby)
    game["queue"].remove(matched_lobby)
    return merged_lobby


def find_suitable(game, lobby):
    for o_lobby in game["queue"]:
        if o_lobby != lobby:
            if within_range(lobby, o_lobby) and not (check_sizes(lobby, o_lobby, game["num_players"]) == 1):
                return o_lobby
    return None


def check_sizes(lobby, o_lobby, num_players_needed):
    # 1 means >  (lobby too big)
    # 0 means =  (lobby just right)
    # -1 means < (lobby too small)
    if lobby["num_players"] + o_lobby["num_players"] > num_players_needed:
        return 1
    if lobby["num_players"] + o_lobby["num_players"] == num_players_needed:
        return 0
    return -1


def within_range(lobby, o_lobby):
    higher_lobby = o_lobby
    lower_lobby = lobby
    if lobby["avg_elo"] > o_lobby["avg_elo"]:
        higher_lobby = lobby
        lower_lobby = o_lobby

    l_lobby_upper_bound = lower_lobby["avg_elo"] + lower_lobby["window_size"]
    h_lobby_lower_bound = higher_lobby["avg_elo"] - higher_lobby["window_size"]

    if l_lobby_upper_bound >= higher_lobby["avg_elo"] and h_lobby_lower_bound <= lower_lobby["avg_elo"]:
        return True
    return False


def expand_window(game):
    window_increment = 10
    print("expanding")
    # print(game)
    for lobby in game["queue"]:
        lobby["window_size"] += window_increment  # use dot operator?
    updated_game = Game(game)  # create updated game
    updated_game["_id"] = ObjectId(game["_id"])  # mongoDB doesn't like string IDs
    updated_game.patch()  # create updated game object and update db


def increment_time_elpased(lobbies):
    for lobby in lobbies:
        lob = Lobby({"_id": lobby["_id"]})
        lob.reload()
        lob["_id"] = ObjectId(lob["_id"])
        lob["time_elapsed"] += 5
        lob.patch()


def team_won(lobby):
    num_teams = len(lobby["teams"])
    is_over = True
    for i in range(num_teams):
        got_votes = False
        for place in lobby["team_info"][i]["votes"]:
            if place > lobby["num_players"]/num_teams:
                got_votes = True
        if not got_votes:
            is_over = False
    # print(is_over)
    return is_over


def is_over(lobby):
    return team_won(lobby) or lobby['time_elapsed'] > 86400  # one day = 86400


def free_discord(room_name):
    dis = Discord().find_by_name(room_name)[0]
    discord = Discord({"_id": dis["_id"]})
    discord.reload()
    discord["_id"] = ObjectId(discord["_id"])
    discord["status"] = "open"
    discord.patch()


def assign_team_elo(team, team_info, oppenent_info, game_name):
    win = team_info["votes"].index(max(team_info["votes"])) - oppenent_info["votes"].index(max(oppenent_info["votes"]))
    if win > 0:
        win = 1
    elif win < 0:
        win = 0
    else:
        win = 0.5

    elo_change = int(team_info["adv_elo"])-calc_elo(int(team_info["adv_elo"]), int(oppenent_info["adv_elo"]), float(win))
    for group in team:
        for player_id in group["players"].keys():
            user = User({"_id": player_id})
            user.reload()
            user["_id"] = ObjectId(user["_id"])
            user["games_table"][game_name]["game_score"] += elo_change
            user.patch()


def compare_other_teams(team, team_info, teams_info, game_name):
    for opponent_info in teams_info:
        assign_team_elo(team, team_info, opponent_info, game_name)


def assign_elos(lobby):
    game = Game({"_id": lobby["game_id"]})
    game.reload()
    for i in range(len(lobby["teams"])):
        compare_other_teams(lobby["teams"][i], lobby["team_info"][i], lobby["team_info"], game["game_name"])


def unqueue_players(groups):
    for group in groups:
        for player_id in group["players"].keys():
            user = User({"_id": player_id})
            user.reload()
            user["_id"] = ObjectId(user["_id"])
            user["in_queue"] = False
            user["lobby"] = None
            user.patch()


def terminate_lobby(lobby):
    free_discord(lobby["discord"])
    assign_elos(lobby)
    unqueue_players(lobby["groups"])
    lob = Lobby({"_id": lobby["_id"]})
    lob.remove()


def check_for_end_match(lobbies):
    for lobby in lobbies:
        if is_over(lobby):
            terminate_lobby(lobby)


if __name__ == '__main__':
    while True:
        games = Game().find_all()
        lobbies = Lobby().find_all()
        for game in games:
            make_matches(game)
            expand_window(game)

        increment_time_elpased(lobbies)
        check_for_end_match(lobbies)
        time.sleep(5)
