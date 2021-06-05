import time

from mongodb import User, Game, Discord, Lobby
from bson import ObjectId
from suitable_lobby import find_suitable
from team_assignment import assign_teams
from end_match import check_for_end_match

def increment_time_elpased(lobbies, clock_delay):
    for lobby in lobbies:
        lob = Lobby({"_id": lobby["_id"]})
        lob.reload()
        lob["_id"] = ObjectId(lob["_id"])
        lob["time_elapsed"] += clock_delay
        lob.save()

def expand_window(game):
    window_increment = 10
    # print("expanding")
    for lobby in game["queue"]:
        lobby["window_size"] += window_increment  # use dot operator?
    updated_game = Game(game)  # create updated game
    updated_game["_id"] = ObjectId(game["_id"])  # mongoDB doesn't like string IDs
    updated_game.patch()  # create updated game object and update db

def remove_groups(full_lobby):
    temp = Lobby({"_id": full_lobby["_id"]})
    temp["_id"] = ObjectId(temp["_id"])
    temp["groups"] = {}
    temp.delete_field()

def set_player_lobby(lobby):
    lobby.reload()
    for group in lobby["groups"]:
        for id in group["players"].keys():
            player = User({"_id": id})
            player["lobby"] = lobby["_id"]
            player["_id"] = ObjectId(id)
            player["in_queue"] = True
            player.patch()

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
        team_info += [{"votes": [0] * num_teams}]
        team_info[i]["adv_elo"] = get_adv_elo(full_lobby["teams"][i], full_lobby["game_id"])
    full_lobby["team_info"] = team_info

def get_next_discord():
    discords = Discord().find_all()
    next_open = None
    i = 0
    while not next_open:
        if i >= len(discords):
            next_open = {"room_name": "all rooms taken"}
        elif discords[i]["status"] == "open":
            next_open = discords[i]
        i += 1

    if next_open != {"room_name": "all rooms taken"}:
        next_open["_id"] = ObjectId(next_open["_id"])
        next_open["status"] = "taken"
        new_discord = Discord(next_open)
        new_discord.patch()

    return {"room_name": next_open["room_name"]}

def init_full_lobby(full_lobby, num_teams, num_players, game_name):
    players_per_team = int(num_players/num_teams)
    assign_teams(full_lobby, num_teams, players_per_team, game_name)
    full_lobby["discord"] = get_next_discord()["room_name"]
    add_team_info(full_lobby)
    full_lobby["time_elapsed"] = 0
    full_lobby["total_votes"] = 0
    full_lobby["time_left"] = 86400

def check_sizes(lobby, o_lobby, num_players_needed):
    # 1 means >  (lobby too big)
    # 0 means =  (lobby just right)
    # -1 means < (lobby too small)
    if lobby["num_players"] + o_lobby["num_players"] > num_players_needed:
        return 1
    if lobby["num_players"] + o_lobby["num_players"] == num_players_needed:
        return 0
    return -1

def merge_matches(game, lobby, matched_lobby):
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

def make_matches(game):
    for lobby in game["queue"]:
        matched_lobby = find_suitable(game, lobby)
        if matched_lobby is not None:
            merged_lobby = merge_matches(game, lobby, matched_lobby)
            if check_sizes(lobby, matched_lobby, game["num_players"]) == 0:
                full_lobby = Lobby(merged_lobby)
                init_full_lobby(full_lobby, game["num_teams"], game["num_players"], game["game_name"])
                full_lobby.save()
                set_player_lobby(full_lobby)
                remove_groups(full_lobby)
            else:
                game["queue"].append(merged_lobby)
            updated_game = Game(game)
            updated_game["_id"] = ObjectId(game["_id"])
            updated_game.patch()

def main():
    clock_delay = 3
    print("timer running")
    while True:
        games = Game().find_all()
        lobbies = Lobby().find_all()
        for game in games:
            make_matches(game)
            expand_window(game)

        increment_time_elpased(lobbies, clock_delay)
        check_for_end_match(lobbies)
        time.sleep(clock_delay)
