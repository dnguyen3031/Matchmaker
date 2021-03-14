import time

from bson import ObjectId
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from mongodb import User
from mongodb import Game


def make_matches(game):
    for lobby in game["queue"]:
        matched_lobby = find_suitable(game, lobby)
        if matched_lobby is not None:
            merged_lobby = merge_matches(game, lobby, matched_lobby)
            if check_sizes == 0:
                #send lobby to in progress
                game["in_progress_matches"].append(merged_lobby)
            else:
                #num players too small, sent back to queue
                game["queue"].append(merged_lobby)
            updated_game = Game(game)  # create updated game
            updated_game["_id"] = ObjectId(game["_id"])  # mongoDB doesn't like string IDs
            updated_game.patch()  # create updated game object and update db


def merge_matches(game, lobby, matched_lobby):
    # takes the two lobbies, removes them from game and returns a merged lobby
    merged_elo = (lobby["avg_elo"] + matched_lobby["avg_elo"])/2
    merged_groups = lobby["groups"] + matched_lobby["groups"]
    merged_num_players = lobby["num_players"] + matched_lobby["num_players"]
    larger_window_size = max(lobby["window_size"], matched_lobby["window_size"])
    merged_lobby ={
        "avg_elo": merged_elo,
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
    if lobby["avg_elo"] > o_lobby["avg_elo"]
        higher_lobby= lobby
        lower_lobby= o_lobby

    l_lobby_upper_bound = lower_lobby["avg_elo"] + lower_lobby["window_size"]
    h_lobby_lower_bound = higher_lobby["avg_elo"] - higher_lobby["window_size"]

    if l_lobby_upper_bound >= higher_lobby["avg_elo"] and h_lobby_lower_bound <= lower_lobby["avg_elo"]:
        return True
    return False


def expand_window(game):
    window_increment = 10
    print(game)
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