from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import random
import string
from mongodb import User
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
            'category': 'FPS',
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

@app.route('/home/<id>', methods=['GET', 'POST'])
def get_users():
    if request.method == 'GET':
        user = User({"_id": id})
        if user.reload():
            return user
        else:
            return jsonify({"error": "User not found"}), 404
    elif request.method == 'POST':
        userToAdd = request.get_json()
        # userToAdd['id'] = generate_id() #old code left here for comparuson
        # users['users_list'].append(userToAdd) #old code left here for comparuson
        newUser = User(userToAdd)
        newUser.save()
        resp = jsonify(newUser), 201
        return resp

@app.route('/profile/<id>', methods=['GET'])
def get_users():
    if request.method == 'GET':
        user = User({"_id": id})
        if user.reload():
            return user
        else:
            return jsonify({"error": "User not found"}), 404