from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import random
import string
from mongodb import User
from mongodb import Game
from bson import ObjectId

app = Flask(__name__)

# CORS stands for Cross Origin Requests.
CORS(app)  # Here we'll allow requests coming from any domain. Not recommended for production environment.

users = {
    'users_list': [
        {
            '_id': 'xyz789',
            'Username': 'Charlie',
            'bio': 'Janitor',
            'password': '123',
            'contact_info': [
                {
                    'email': 'fuck@gmail.com',
                    'discord': 'damn#1234'
                }
            ],
            'games_table': [
                {
                    'game_name': 'Krunker',
                    'game_score': '420'
                }
            ]
        }
    ]
}

games = {
    'games_list': [
        {
            '_id': '8582',
            'game_name': 'Krunker',
            'categories': [
                'FPS',
                'Free'
                ],
            'game_modes': [
                {
                    'mode_name': 'Free For All',
                    'relevant_stats': [
                        {
                            'stat_name': 'k/d'
                        },
                        {
                            'stat_name': 'win/loss'
                        }
                    ]
                },
                {
                    'mode_name': 'Team Deathmatch',
                    'relevant_stats': [
                        {
                            'stat_name': 'k/d'
                        },
                        {
                            'stat_name': 'win/loss'
                        }
                    ]
                }
            ]
        }
    ]
}

@app.route('/users', methods=['GET', 'POST'])
def get_users():
    if request.method == 'GET':
        search_username = request.args.get('name')
        if search_username:
            # return find_users_by_name(search_username) #old code left here for comparuson
            users = User().find_by_name(search_username)
        else:
            users = User().find_all()
        return {"users_list": users}
    elif request.method == 'POST':
        userToAdd = request.get_json()
        newUser = User(userToAdd)
        newUser.save()
        resp = jsonify(newUser), 201
        return resp

@app.route('/users/<id>', methods=['GET', 'DELETE'])
def get_user():
    if request.method == 'GET':
        user = User({"_id": id})
        if user.reload():
            return user
        else:
            return jsonify({"error": "User not found"}), 404
    elif request.method == 'DELETE':  ## still the old version. Turn it into the DB version
        user = User({"_id": id})
        if user.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "User not found"}), 404


@app.route('/games', methods=['GET', 'POST'])
def get_games():
    if request.method == 'GET':
        search_gamename = request.args.get('game_name')
        if search_gamename:
            # return find_users_by_name(search_username) #old code left here for comparuson
            games = Game().find_by_name(search_gamename)
        else:
            games = Game().find_all()
        return {"games_list": games}
    elif request.method == 'POST':
        gameToAdd = request.get_json()
        newGame = Game(gameToAdd)
        newGame.save()
        resp = jsonify(newGame), 201
        return resp

@app.route('/games/<id>', methods=['GET', 'DELETE'])
def get_game():
    if request.method == 'GET':
        game = Game({"_id": id})
        if game.reload():
            return game
        else:
            return jsonify({"error": "Game not found"}), 404
    elif request.method == 'DELETE':  ## still the old version. Turn it into the DB version
        game = Game({"_id": id})
        if game.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Game not found"}), 404