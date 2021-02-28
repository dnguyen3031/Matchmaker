from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import random
import string
from mongodb import User
from mongodb import Game
from ELO import *
from bson import ObjectId


app = Flask(__name__)

# CORS stands for Cross Origin Requests.
CORS(app)  # Here we'll allow requests coming from any domain. Not recommended for production environment.


# users = {
#     'users_list': [
#         {
#             "_id": "6024098ac9b27e9f9995df97",
#             "bio": "the template for a user",
#             "contact_info": {
#                 "discord": "template#1234",
#                 "email": "template@gmail.com"
#             },
#             "games_table": {
#                 "Krunker": {
#                     "game_score": "420",
#                     "time_played": "2.4"
#                 },
#                 "Minecraft": {
#                     "game_score": "69",
#                     "time_played": "128.2"
#                 }
#             },
#             "name": "Template",
#             "password": "no security"
#         }
#     ]
# }
#
# games = {
#     "games_list": [
#         {
#             "_id": "60240d8261cfcfb0e9a958cb",
#             "categories": [
#                 "FPS",
#                 "Free",
#                 "Browser Game"
#             ],
#             "game_modes": {
#                 "Capture_The_Flag": {
#                     "relevant_stats": [
#                         "Score",
#                         "Kills",
#                         "Deaths",
#                         "Win/Loss/Draw",
#                         "Caps"
#                     ]
#                 },
#                 "Free_For_All": {
#                     "relevant_stats": [
#                         "Kills",
#                         "Deaths",
#                         "Win/Loss/Draw",
#                         "Score"
#                     ]
#                 },
#                 "Team_Deathmatch": {
#                     "relevant_stats": [
#                         "Kills",
#                         "Deaths",
#                         "Win/Loss/Draw",
#                         "Score"
#                     ]
#                 }
#             },
#             "game_name": "Krunker",
#             "run_difficulty": "3"
#         }
#     ]
# }


@app.route('/')
def backend_home():
    return 'You have reached the backend'


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


@app.route('/users/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_user(id):
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
    elif request.method == 'PATCH':
        userToUpdate = request.get_json()
        userToUpdate["_id"] = ObjectId(id)
        newUser = User(userToUpdate)
        newUser.patch()
        resp = jsonify(newUser), 201
        return resp


@app.route('/games', methods=['GET', 'POST'])
def get_games():
    if request.method == 'GET':
        search_gamename = request.args.get('game_name')
        if search_gamename:
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


@app.route('/games/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_game(id):
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
    elif request.method == 'PATCH':
        gameToUpdate = request.get_json()
        gameToUpdate["_id"] = ObjectId(id)
        newGame = Game(gameToUpdate)
        newGame.patch()
        resp = jsonify(newGame), 201
        return resp

@app.route('/users/submit-results', methods=['PATCH'])
def submit_results():
    if request.method == 'PATCH':
        #JSON has user ID, opponents's elo, win/loss, game name
        results = request.get_json()
        #print(results)
        #for key, value in results.items():
        #    print(key, value)
        #print(results['user_id'])
        #print(results.user_id)
        user = User({"_id": results['user_id']})
        if user.reload():
            elo = user.games_table[results['game_name']]['game_score']
            new_elo = calc_elo(int(elo),int(results['opp_elo']), float(results['win']))
            user.games_table[results['game_name']]['game_score'] = new_elo
            user["_id"] = ObjectId(results['user_id'])
            user.patch()
            resp = jsonify(user), 201
            return resp
        else:
            return jsonify({"error": "User not found"}), 404



