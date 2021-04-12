import time

from bson import ObjectId
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from mongodb import User
from mongodb import Game, Lobby


def make_matches(game):
    for lobby in game["queue"]:
        matched_lobby = find_suitable(game, lobby)
        if matched_lobby is not None:
            merged_lobby = merge_matches(game, lobby, matched_lobby)
            if check_sizes(lobby, matched_lobby, game["num_players"]) == 0:
                #send lobby to in progress
                print("lobby to add")
                full_lobby = Lobby(merged_lobby)
                print("full_lobby", full_lobby)
                assignteams(full_lobby)
                print("full_lobby", full_lobby)
                full_lobby.save()
                set_player_lobby(full_lobby)

            else:
                #num players too small, sent back to queue
                game["queue"].append(merged_lobby)
            updated_game = Game(game)  # create updated game
            updated_game["_id"] = ObjectId(game["_id"])  # mongoDB doesn't like string IDs
            updated_game.patch()  # create updated game object and update db


def assignteams(full_lobby):
    print("assiging teams")
    game = Game({"_id": full_lobby["game_id"]})
    game.reload()
    team1, team2 = find_best_teams(full_lobby["groups"])
    full_lobby["teams"] = [team1, team2]
    print("teams", team1, " ", team2)


def find_best_teams(groups):
    team1, team2 = {"size": 0, "groups": []}, {"size": 0, "groups": []}
    unused_groups = [] + groups
    print("unused_groups ", unused_groups)
    for i in range(len(groups)):
        if team1["size"] > team2["size"]:
            temp = largest_group(unused_groups)
            print("temp: ", temp)
            team2["groups"] += [temp]
            team2["size"] += len(temp["players"])
        else:
            temp = largest_group(unused_groups)
            print("temp: ", temp)
            team1["groups"] += [temp]
            team1["size"] += len(temp["players"])
    print("team1 ", team1)
    print("team2 ", team2)
    return team1["groups"], team2["groups"]


def largest_group(unused_groups):
    largest_group = 0
    for i in range(len(unused_groups)):
        if len(unused_groups[i]["players"]) > len(unused_groups[largest_group]["players"]):
            largest_group = i
    return unused_groups.pop(largest_group)


def set_player_lobby(lobby):
    lobby.reload()
    for group in lobby["groups"]:
        for id in group["players"]:
            player = User({"_id": id})
            player.reload()
            player["lobby"] = lobby["_id"]
            player["_id"] = ObjectId(id)
            player.patch()


def merge_matches(game, lobby, matched_lobby):
    # takes the two lobbies, removes them from game and returns a merged lobby
    #TODO: record avg elo for each groop for team-making purposes
    merged_elo = (lobby["avg_elo"]*lobby["num_players"] + matched_lobby["avg_elo"]*matched_lobby["num_players"])/(
                lobby["num_players"]+matched_lobby["num_players"])
    merged_groups = lobby["groups"] + matched_lobby["groups"]
    merged_num_players = lobby["num_players"] + matched_lobby["num_players"]
    larger_window_size = max(lobby["window_size"], matched_lobby["window_size"])
    merged_lobby ={
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
    if lobby["num_players"] + o_lobby["num_players"] > num_players_needed :
        return 1
    if lobby["num_players"] + o_lobby["num_players"] == num_players_needed :
        return 0
    return -1

def within_range(lobby, o_lobby):
    higher_lobby = o_lobby
    lower_lobby = lobby
    if lobby["avg_elo"] > o_lobby["avg_elo"]:
        higher_lobby= lobby
        lower_lobby= o_lobby

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
        lobby["window_size"] += window_increment        #use dot operator?
    updated_game = Game(game)  # create updated game
    updated_game["_id"] = ObjectId(game["_id"]) #mongoDB doesn't like string IDs
    updated_game.patch()  # create updated game object and update db


if __name__ == '__main__':
    while True:
        games = Game().find_all()
        for game in games:
            make_matches(game)
            expand_window(game)

        time.sleep(5)