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
        find_suitable(game, lobby)
        check_sizes()
        merge_matches()
        if lobby.num_players == game.num_players:
            #send lobby to fe?
            delete lobby()

def find_suitable(game, lobby):
    for o_lobby in game["queue"]:
        if o_lobby != lobby:
            if within_range(lobby, o_lobby)


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
    # game should be used just for the name as to prevent multiple user database shenanigans
    # jk we decided to break this rule- may cause errors
    window_increment = 10
    print(game)
    for lobby in game["queue"]:
        lobby["window_size"] += window_increment        #use dot operator?
    updated_game = Game(game)  # create updated game
    updated_game["_id"] = ObjectId(game["_id"])
    updated_game.patch()  # create updated game object and update db


if __name__ == '__main__':
    print("jello world")
    while True:
        games = Game().find_all()
        for game in games:
            make_matches(game)
            expand_window(game)

        time.sleep(5)