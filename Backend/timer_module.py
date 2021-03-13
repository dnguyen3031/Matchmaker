import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from mongodb import User
from mongodb import Game



def expand_window(game):
    # game should be used just for the name as to prevent multiple user database shenanigans
    # jk we decided to break this rule
    window_increment = 10
    print(game)
    for lobby in game.queue:
        lobby["window_size"] += window_increment        #use dot operator?


if __name__ == '__main__':
    print("jello world")
    while True:
        time.sleep(5)
        games = Game().find_all()
        for game in games:
            expand_window(game)