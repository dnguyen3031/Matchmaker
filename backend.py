from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from mongodb import *
from ELO import *
from bson import ObjectId
import timer_module
import threading
from end_match import terminate_lobby

app = Flask(__name__)

CORS(app)

threading.Thread(target=timer_module.main).start()


@app.route('/')
def backend_home():
    return 'You have reached the backend'


@app.route('/users', methods=['GET', 'POST'])
def get_users():
    if request.method == 'GET':
        search_username = request.args.get('name')
        search_username_secure = request.args.get('secureName')
        search_email = request.args.get('email')
        if search_email:
            users = User().find_by_email(search_email)
        elif search_username:
            users = User().find_by_name(search_username)
        elif search_username_secure:
            users = User().secure_find_by_name(search_username_secure)
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
    elif request.method == 'DELETE':
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


@app.route('/users/submit-results2', methods=['PATCH'])
def submit_results2():
    if request.method == 'PATCH':
        results = request.get_json()
        user = User({"_id": results['user_id']})
        if user.reload():
            elo = user.current_match['team_elo']
            new_elo = calc_elo(int(elo), int(user.current_match['opp_elo']), float(results['win']))
            user.games_table[results['game_name']]['game_score'] += (new_elo - elo)
            user["_id"] = ObjectId(results['user_id'])
            user.patch()
            resp = jsonify(user), 201
            return resp
        else:
            return jsonify({"error": "User not found"}), 404


@app.route('/groups', methods=['GET', 'POST'])
def get_groups():
    if request.method == 'GET':
        groups = Group().find_all()
        return {"groups_list": groups}
    elif request.method == 'POST':
        group_to_add = request.get_json()
        new_group = Group(group_to_add)
        new_group.save()
        resp = jsonify(new_group._id), 201
        return resp


@app.route('/groups/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_group(id):
    if request.method == 'GET':
        group = Group({"_id": id})
        if group.reload():
            return group
        else:
            return jsonify({"error": "Group not found"}), 404
    elif request.method == 'DELETE':
        group = Group({"_id": id})
        if group.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Group not found"}), 404
    elif request.method == 'PATCH':
        group_to_update = request.get_json()
        group_to_update["_id"] = ObjectId(id)
        new_group = Group(group_to_update)
        new_group.patch()
        resp = jsonify(new_group), 201
        return resp


@app.route('/groups/join-group', methods=['PATCH'])
def join_group():
    if request.method == 'PATCH':
        groupID = request.args.get('group')
        userID = request.args.get('id')
        group = Group({"_id": groupID})
        group.reload()

        user = User({"_id": userID})
        user.reload()

        if user.get('group') is not None:
            resp = jsonify('You are already in a group!'), 400
            return resp

        groupPlayers = group.get('players')
        groupPlayers[userID] = user.get('name')
        group['players'] = groupPlayers
        group['num_players'] += 1
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
        group_id = request.args.get('group')
        user_id = request.args.get('id')
        group = Group({"_id": group_id})
        group.reload()
        user = User({"_id": user_id})
        user.reload()

        popped_value = group['players'].pop(str(user_id))
        if popped_value != user.get('name'):
            resp = jsonify(popped_value), 400
            return resp

        group['num_players'] -= 1
        group["_id"] = ObjectId(group_id)

        if group['num_players'] == 0:
            group.remove()
        else:
            group.save()

        user['group'] = None
        user["_id"] = ObjectId(user_id)
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
        game_to_add = request.get_json()
        new_game = Game(game_to_add)
        new_game.save()
        resp = jsonify(new_game), 201
        return resp


@app.route('/games/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_game(id):
    if request.method == 'GET':
        game = Game({"_id": id})
        if game.reload():
            return game
        else:
            return jsonify({"error": "Game not found"}), 404
    elif request.method == 'DELETE':
        game = Game({"_id": id})
        if game.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Game not found"}), 404
    elif request.method == 'PATCH':
        game_to_update = request.get_json()
        game_to_update["_id"] = ObjectId(id)
        new_game = Game(game_to_update)
        new_game.patch()
        resp = jsonify(new_game), 201
        return resp


@app.route('/lobbies', methods=['GET', 'POST'])
def get_lobbies():
    if request.method == 'GET':
        lobbies = Lobby().find_all()
        return {"lobbies_list": lobbies}
    elif request.method == 'POST':
        lobby_to_add = request.get_json()
        new_lobby = Lobby(lobby_to_add)
        new_lobby.save()
        resp = jsonify(new_lobby), 201
        return resp


@app.route('/lobbies/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_lobby(id):
    if request.method == 'GET':
        lobby = Lobby({"_id": id})
        if lobby.reload():
            return lobby
        else:
            return jsonify({"error": "Lobby not found"}), 404
    elif request.method == 'DELETE':
        lobby = Lobby({"_id": id})
        if lobby.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Lobby not found"}), 404
    elif request.method == 'PATCH':
        lobby_to_update = request.get_json()
        lobby_to_update["_id"] = ObjectId(id)
        new_lobby = Lobby(lobby_to_update)
        new_lobby.patch()
        resp = jsonify(new_lobby), 201
        return resp


@app.route('/lobbies/submit-results/<id>', methods=['PATCH'])
def submit_results(id):
    if request.method == 'PATCH':
        results = request.get_json()
        lobby = Lobby({"_id": id})
        if not lobby.reload():
            return jsonify({"error": "Lobby not found"}), 404
        lobby["_id"] = ObjectId(id)
        ranking = results["ranking"]
        print(len(ranking))
        for i in range(len(ranking)):
            lobby["team_info"][i]["votes"][ranking[i] - 1] += 1
        lobby["total_votes"] += 1
        lobby.patch()

        resp = jsonify(lobby), 200
        return resp


@app.route('/lobbies/end-lobby/<id>', methods=['PATCH'])
def end_lobby(id):
    if request.method == 'PATCH':
        lobby = Lobby({"_id": id})
        if lobby.reload():
            terminate_lobby(lobby)
            return lobby
        else:
            return jsonify({"error": "Lobby not found"}), 404


def set_users_in_queue(new_lobby):
    for player in new_lobby["groups"][0]["players"]:
        user = User({"_id": player})
        user.reload()
        user["in_queue"] = True
        user["_id"] = ObjectId(player)
        user.patch()


@app.route('/matchmaking/add-to-queue', methods=['PATCH'])
def add_to_queue():
    if request.method == 'PATCH':
        starting_window_size = 50
        game_name = request.args.get('game_name')
        search_game = Game().find_by_name(game_name)[0]
        game = Game({"_id": search_game["_id"]})
        user_id = request.args.get('id')
        user = User({"_id": user_id})
        if user.reload() and game.reload():
            elo = user.games_table[game_name]['game_score']
            print("getting queued")
            if user.group is None:
                group_to_add = {"players": {user_id: user["name"]}, "num_players": 1}
                current_group = Group(group_to_add)
                current_group.save()
                user["group"] = current_group._id
            else:
                current_group = Group({"_id": user.group})
                current_group.reload()
            new_lobby = {
                "game_id": game["_id"],
                "avg_elo": elo,
                "groups": [current_group],
                "num_players": current_group.num_players,
                "window_size": starting_window_size,
            }
            print(new_lobby)
            resp = game.append_to_queue(game_name, new_lobby)
            if not resp == "lobby not added to queue":
                set_users_in_queue(new_lobby)
            else:
                print("problem")
                print(new_lobby)
                print(game_name)
                print(resp)
            return jsonify(resp), 201
        else:
            return jsonify({"error": "User or game not found"}), 404

@app.route('/matchmaking/add-new-game', methods=['PATCH'])
def add_new_game():
    if request.method == 'PATCH':
        game_name = request.args.get('game_name')
        user_id = request.args.get('id')
        user = User({"_id": user_id})
        search_game = Game().find_by_name(game_name)[0]
        if search_game: #actually returns a game
            if user.reload():
                user["games_table"][game_name] = {
                            "game_score": 1000,
                            "time_played": 0
                        }
                user["_id"] = ObjectId(user_id)
                user.patch()
                return jsonify({"sucess": "Game added to list"}), 201
            else:
                return jsonify({"error": "User not found"}), 404
        else:
            return jsonify({"error": "Game not found"}), 404



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
    elif request.method == 'DELETE':
        discord = Discord({"_id": id})
        if discord.remove():
            resp = jsonify(), 204
            return resp
        return jsonify({"error": "Discord not found"}), 404
    elif request.method == 'PATCH':
        discord_to_update = request.get_json()
        discord_to_update["_id"] = ObjectId(id)
        new_discord = Discord(discord_to_update)
        new_discord.patch()
        resp = jsonify(new_discord), 201
        return resp


@app.route('/discords/next', methods=['GET'])
def get_next_discord():
    if request.method == 'GET':
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
