from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import random
import string
from mongodb import *
from ELO import *
from bson import ObjectId

app = Flask(__name__)

# CORS stands for Cross Origin Requests.
CORS(app)  # Here we'll allow requests coming from any domain. Not recommended for production environment.


# TODO: start timer_module asynchronously on startup

@app.route('/')
def backend_home():
    return 'You have reached the backend'


@app.route('/users', methods=['GET', 'POST'])
def get_users():
    if request.method == 'GET':
        search_username = request.args.get('name')
        search_email = request.args.get('email')
        if search_email:
            users = User().find_by_email(search_email)
        elif search_username:
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
        search_for_group = request.args.get('group')
        user = User({"_id": id})
        if user.reload():
            if search_for_group:
                return str(user.get('group'))
            else:
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


@app.route('/groups', methods=['GET', 'POST'])
def get_groups():
    if request.method == 'GET':
        groups = Group().find_all()
        return {"groups_list": groups}
    elif request.method == 'POST':
        groupToAdd = request.get_json()
        newGroup = Group(groupToAdd)
        newGroup.save()
        resp = jsonify(newGroup._id), 201
        return resp


@app.route('/groups/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_group(id):
    if request.method == 'GET':
        group = Group({"_id": id})
        if group.reload():
            return group
        else:
            return jsonify({"error": "Group not found"}), 404
    elif request.method == 'DELETE':  ## still the old version. Turn it into the DB version
        group = Group({"_id": id})
        if group.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Group not found"}), 404
    elif request.method == 'PATCH':  ## will work for adding users to group, unsure about leaving
        groupToUpdate = request.get_json()
        groupToUpdate["_id"] = ObjectId(id)
        newGroup = Group(groupToUpdate)
        newGroup.patch()
        resp = jsonify(newGroup), 201
        return resp


@app.route('/groups/join-group', methods=['PATCH'])
def join_group():
    if request.method == 'PATCH':
        groupID = request.args.get('group')
        userID = request.args.get('id')
        group = Group({"_id": groupID})
        user = User({"_id": userID})
        group.reload()
        user.reload()
        groupUsers = group.get('players')
        groupUsers[userID] = user["name"]
        # groupUsers = list(set(groupUsers))
        group['players'] = groupUsers
        group["_id"] = ObjectId(groupID)
        group.patch()

        user['group'] = groupID
        user["_id"] = ObjectId(userID)
        user.patch()

        resp = jsonify(group), 201
        return resp


@app.route('/groups/leave-group', methods=['PATCH'])
def leave_group():
    if request.method == 'PATCH':
        groupID = request.args.get('group')
        userID = request.args.get('id')
        group = Group({"_id": groupID})
        group.reload()
        groupUsers = group.get('players')
        groupUsers.remove(userID)
        groupUsers = list(set(groupUsers))
        group['players'] = groupUsers
        group["_id"] = ObjectId(groupID)
        group.patch()

        user = User({"_id": userID})
        user.reload()
        user['group'] = None
        user["_id"] = ObjectId(userID)
        user.patch()

        resp = jsonify(group), 201
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


@app.route('/lobbies', methods=['GET', 'POST'])
def get_lobbies():
    if request.method == 'GET':
        lobbies = Lobby().find_all()
        return {"lobbies_list": lobbies}
    elif request.method == 'POST':
        lobbyToAdd = request.get_json()
        newLobby = Lobby(lobbyToAdd)
        newLobby.save()
        resp = jsonify(newLobby), 201
        return resp


@app.route('/lobbies/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_lobby(id):
    if request.method == 'GET':
        lobby = Lobby({"_id": id})
        if lobby.reload():
            return lobby
        else:
            return jsonify({"error": "Lobby not found"}), 404
    elif request.method == 'DELETE':  ## still the old version. Turn it into the DB version
        lobby = Lobby({"_id": id})
        if lobby.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Lobby not found"}), 404
    elif request.method == 'PATCH':
        lobbyToUpdate = request.get_json()
        lobbyToUpdate["_id"] = ObjectId(id)
        newLobby = Lobby(lobbyToUpdate)
        newLobby.patch()
        resp = jsonify(newLobby), 201
        return resp


@app.route('/matchmaking/add-to-queue', methods=['PATCH'])
def add_to_queue():
    if request.method == 'PATCH':
        starting_window_size = 50
        game_name = request.args.get('game_name')
        user_id = request.args.get('id')
        search_game = Game().find_by_name(game_name)[0]
        game = Game({"_id": search_game["_id"]})
        game.reload()
        # print("game_name", game_name)
        # print("\n\ngame dic", game, "\n\n")
        user = User({"_id": user_id})
        if user.reload():
            elo = user.games_table[game_name]['game_score']  # use . ?
            new_lobby = {
                "game_id": game["_id"],
                "avg_elo": elo,
                "groups": [
                    {
                        "players": {
                            user_id: user["name"]
                        }
                    }
                ],
                "num_players": 1,
                "window_size": starting_window_size,
            }
            resp = game.append_to_queue(game_name, new_lobby)  # game name might need to match (line 210)
            return jsonify(resp), 201
        else:
            return jsonify({"error": "User not found"}), 404


@app.route('/users/submit-results', methods=['PATCH'])
def submit_results():
    if request.method == 'PATCH':
        # JSON has user ID, opponents's elo, win/loss, game name
        results = request.get_json()
        # print(results)
        # for key, value in results.items():
        #    print(key, value)
        # print(results['user_id'])
        # print(results.user_id)
        user = User({"_id": results['user_id']})
        if user.reload():
            elo = user.games_table[results['game_name']]['game_score']
            new_elo = calc_elo(int(elo), int(results['opp_elo']), float(results['win']))
            user.games_table[results['game_name']]['game_score'] = new_elo
            user["_id"] = ObjectId(results['user_id'])
            user.patch()
            resp = jsonify(user), 201
            return resp
        else:
            return jsonify({"error": "User not found"}), 404


@app.route('/discords', methods=['GET', 'POST'])
def get_discords():
    if request.method == 'GET':
        discords = Discord().find_all()
        return {"discords_list": discords}
    elif request.method == 'POST':
        discordToAdd = request.get_json()
        newDiscord = Discord(discordToAdd)
        newDiscord.save()
        resp = jsonify(newDiscord), 201
        return resp


@app.route('/discords/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_discord(id):
    if request.method == 'GET':
        discord = Discord({"_id": id})
        if discord.reload():
            return discord
        else:
            return jsonify({"error": "Discord not found"}), 404
    elif request.method == 'DELETE':  ## still the old version. Turn it into the DB version
        discord = Discord({"_id": id})
        if discord.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Discord not found"}), 404
    elif request.method == 'PATCH':
        discordToUpdate = request.get_json()
        discordToUpdate["_id"] = ObjectId(id)
        newDiscord = Discord(discordToUpdate)
        newDiscord.patch()
        resp = jsonify(newDiscord), 201
        return resp


@app.route('/discords/next', methods=['GET'])
def get_next_discord():
    if request.method == 'GET':
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

        return {"discords_list": nextOpen["room_name"]}
