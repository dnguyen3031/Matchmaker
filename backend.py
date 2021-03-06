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


def reset_games():
    games = Game().find_all()
    for game_dic in games:
        game = Game(game_dic)
        game.reload()
        game["_id"] = ObjectId(game["_id"])
        game["queue"] = []
        game.patch()


def reset_groups():
    groups = Group().find_all()
    for group_dic in groups:
        group = Group(group_dic)
        group["_id"] = ObjectId(group["_id"])
        group.remove()


def reset_discords():
    discords = Discord().find_all()
    for discord_dic in discords:
        discord = Discord(discord_dic)
        discord.reload()
        discord["_id"] = ObjectId(discord["_id"])
        discord["status"] = "open"
        discord.patch()


def reset_lobbies():
    lobbies = Lobby().find_all()
    for lobby_dic in lobbies:
        lobby = Lobby(lobby_dic)
        lobby["_id"] = ObjectId(lobby["_id"])
        lobby.remove()


def reset_users():
    users = User().find_all()
    for user_dic in users:
        user = User(user_dic)
        user.reload()
        user["_id"] = ObjectId(user["_id"])
        user["group"] = None
        user["in_queue"] = False
        user["has_voted"] = False
        user["lobby"] = None
        user.patch()
        if user["email"] == "testCreate@gmail.com":
            user.remove()


def reset_patch():
    reset_users()
    reset_lobbies()
    reset_discords()
    reset_groups()
    reset_games()


@app.route('/reset', methods=['PATCH'])
def reset():
    if request.method == 'PATCH':
        reset_patch()
        resp = jsonify("Everything reset"), 201
        return resp


def get_users_post(userToAdd):
    newUser = User(userToAdd)
    newUser.save()
    resp = jsonify(newUser), 201
    return resp


def get_users_get(search_username, search_username_secure, search_email):
    if search_email:
        users = User().find_by_email(search_email)
    elif search_username:
        users = User().find_by_name(search_username)
    elif search_username_secure:
        users = User().secure_find_by_name(search_username_secure)
    else:
        users = User().find_all()
    return {"users_list": users}


@app.route('/users', methods=['GET', 'POST'])
def get_users():
    if request.method == 'GET':
        return get_users_get(request.args.get('name'), request.args.get('secureName'), request.args.get('email'))
    elif request.method == 'POST':
        return get_users_post(request.get_json())


def get_user_patch(id, userToUpdate):
    userToUpdate["_id"] = ObjectId(id)
    newUser = User(userToUpdate)
    newUser.patch()
    resp = jsonify(newUser), 201
    return resp


def get_user_delete(id):
    user = User({"_id": id})
    if user.remove():
        resp = jsonify(), 204
        return resp
    return jsonify({"error": "User not found"}), 404


def get_user_get(id, search_for_group):
    user = User({"_id": id})
    if user.reload():
        if search_for_group:
            return str(user.get('group'))
        else:
            return user
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/users/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_user(id):
    if request.method == 'GET':
        return get_user_get(id, request.args.get('group'))
    elif request.method == 'DELETE':
        return get_user_delete(id)
    elif request.method == 'PATCH':
        return get_user_patch(id, request.get_json())


def submit_results2_patch(results):
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


@app.route('/users/submit-results2', methods=['PATCH'])
def submit_results2():
    if request.method == 'PATCH':
        return submit_results2_patch(request.get_json())


def get_groups_post(group_to_add):
    new_group = Group(group_to_add)
    new_group.save()
    resp = jsonify(new_group._id), 201
    return resp


def get_groups_get():
    return {"groups_list": Group().find_all()}


@app.route('/groups', methods=['GET', 'POST'])
def get_groups():
    if request.method == 'GET':
        return get_groups_get()
    elif request.method == 'POST':
        return get_groups_post(request.get_json())


def get_group_patch(id, group_to_update):
    group_to_update["_id"] = ObjectId(id)
    new_group = Group(group_to_update)
    new_group.patch()
    resp = jsonify(new_group), 201
    return resp


def get_group_delete(id):
    group = Group({"_id": id})
    if group.remove():
        resp = jsonify(), 204
        return resp
    return jsonify({"error": "Group not found"}), 404


def get_group_get(id):
    group = Group({"_id": id})
    if group.reload():
        return group
    else:
        return jsonify({"error": "Group not found"}), 404


@app.route('/groups/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_group(id):
    if request.method == 'GET':
        return get_group_get(id)
    elif request.method == 'DELETE':
        return get_group_delete(id)
    elif request.method == 'PATCH':
        return get_group_patch(id, request.get_json())


def join_group_patch(groupID, userID):
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


@app.route('/groups/join-group', methods=['PATCH'])
def join_group():
    if request.method == 'PATCH':
        return join_group_patch(request.args.get('group'), request.args.get('id'))


def leave_group_patch(group_id, user_id):
    user = User({"_id": user_id})
    user.reload()
    user['group'] = None
    user["_id"] = ObjectId(user_id)
    user.patch()

    group = Group({"_id": group_id})
    if group.reload():
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

    resp = jsonify(group), 201
    return resp


@app.route('/groups/leave-group', methods=['PATCH'])
def leave_group():
    if request.method == 'PATCH':
        return leave_group_patch(request.args.get('group'), request.args.get('id'))


def get_games_post(game_to_add):
    new_game = Game(game_to_add)
    new_game.save()
    resp = jsonify(new_game), 201
    return resp


def get_games_get(search_gamename):
    if search_gamename:
        games = Game().find_by_name(search_gamename)
    else:
        games = Game().find_all()
    return {"games_list": games}


@app.route('/games', methods=['GET', 'POST'])
def get_games():
    if request.method == 'GET':
        return get_games_get(request.args.get('game_name'))
    elif request.method == 'POST':
        return get_games_post(request.get_json())


def get_game_patch(id, game_to_update):
    game_to_update["_id"] = ObjectId(id)
    new_game = Game(game_to_update)
    new_game.patch()
    resp = jsonify(new_game), 201
    return resp


def get_game_delete(id):
    game = Game({"_id": id})
    if game.remove():
        resp = jsonify(), 204
        return resp
    return jsonify({"error": "Game not found"}), 404


def get_game_get(id):
    game = Game({"_id": id})
    if game.reload():
        return game
    else:
        return jsonify({"error": "Game not found"}), 404


@app.route('/games/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_game(id):
    if request.method == 'GET':
        return get_game_get(id)
    elif request.method == 'DELETE':
        return get_game_delete(id)
    elif request.method == 'PATCH':
        return get_game_patch(id, request.get_json())


def get_lobbies_post(lobby_to_add):
    new_lobby = Lobby(lobby_to_add)
    new_lobby.save()
    resp = jsonify(new_lobby), 201
    return resp


def get_lobbies_get():
    lobbies = Lobby().find_all()
    return {"lobbies_list": lobbies}


@app.route('/lobbies', methods=['GET', 'POST'])
def get_lobbies():
    if request.method == 'GET':
        return get_lobbies_get()
    elif request.method == 'POST':
        return get_lobbies_post(request.get_json())


def get_lobby_patch(id, lobby_to_update):
    lobby_to_update["_id"] = ObjectId(id)
    new_lobby = Lobby(lobby_to_update)
    new_lobby.patch()
    resp = jsonify(new_lobby), 201
    return resp


def get_lobby_delete(id):
    lobby = Lobby({"_id": id})
    if lobby.remove():
        resp = jsonify(), 204
        return resp
    return jsonify({"error": "Lobby not found"}), 404


def get_lobby_get(id):
    lobby = Lobby({"_id": id})
    if lobby.reload():
        return lobby
    else:
        return jsonify({"error": "Lobby not found"}), 404


@app.route('/lobbies/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_lobby(id):
    if request.method == 'GET':
        return get_lobby_get(id)
    elif request.method == 'DELETE':
        return get_lobby_delete(id)
    elif request.method == 'PATCH':
        return get_lobby_patch(id, request.get_json())


def submit_results_patch(lobby_id, user_id, results):
    lobby = Lobby({"_id": lobby_id})
    user = User({"_id": user_id})
    if not lobby.reload():
        return jsonify({"error": "Lobby not found"}), 404
    if not user.reload():
        return jsonify({"error": "User not found"}), 404
    lobby["_id"] = ObjectId(lobby_id)
    ranking = results["ranking"]
    print(len(ranking))
    for i in range(len(ranking)):
        lobby["team_info"][i]["votes"][ranking[i] - 1] += 1
    lobby["total_votes"] += 1
    lobby.patch()
    user["has_voted"] = True
    user["_id"] = ObjectId(user_id)
    user.patch()
    resp = jsonify(lobby), 200
    return resp


@app.route('/lobbies/submit-results', methods=['PATCH'])
def submit_results():
    if request.method == 'PATCH':
        return submit_results_patch(request.args.get('lobby_id'), request.args.get('id'), request.get_json())


def end_lobby_patch(id):
    lobby = Lobby({"_id": id})
    if lobby.reload():
        terminate_lobby(lobby)
        return lobby
    else:
        return jsonify({"error": "Lobby not found"}), 404


@app.route('/lobbies/end-lobby/<id>', methods=['PATCH'])
def end_lobby(id):
    if request.method == 'PATCH':
        return end_lobby_patch(id)


def set_users_in_queue(lobby):
    for player in lobby["groups"][0]["players"]:
        user = User({"_id": player})
        user.reload()
        user["in_queue"] = True
        user["_id"] = ObjectId(player)
        user.patch()


def add_to_queue_patch(game_name, user_id):
    starting_window_size = 50
    search_game = Game().find_by_name(game_name)[0]
    game = Game({"_id": search_game["_id"]})
    user = User({"_id": user_id})
    if user.reload() and game.reload():
        elo = user.games_table[game_name]['game_score']
        print("getting queued")
        if user['group'] is None:
            group_to_add = {"players": {user_id: user["name"]}, "num_players": 1}
            current_group = Group(group_to_add)
            current_group.save()
            print("current_group",current_group)
            user["group"] = current_group['_id']
            user['_id'] = ObjectId(user['_id'])
            user.patch()
        else:
            current_group = Group({"_id": user['group']})
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
        set_users_in_queue(new_lobby)
        return jsonify(resp), 201
    else:
        return jsonify({"error": "User or game not found"}), 404


@app.route('/matchmaking/add-to-queue', methods=['PATCH'])
def add_to_queue():
    if request.method == 'PATCH':
        return add_to_queue_patch(request.args.get('game_name'), request.args.get('id'))


def add_new_game_patch(game_name, user_id):
    user = User({"_id": user_id})
    search_game = Game().find_by_name(game_name)[0]
    if search_game:  # actually returns a game
        if user.reload():
            if game_name not in user["games_table"]:
                user["games_table"][game_name] = {
                    "game_score": 1000,
                    "time_played": 0
                }
                user["_id"] = ObjectId(user_id)
                user.patch()
                return jsonify({"success": "Game added to list"}), 201
            else:
                return jsonify({"error": "Game already in users"}), 404
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Game not found"}), 404


@app.route('/matchmaking/add-new-game', methods=['PATCH'])
def add_new_game():
    if request.method == 'PATCH':
        return add_new_game_patch(request.args.get('game_name'), request.args.get('id'))


def get_discords_post(discordToAdd):
    newDiscord = Discord(discordToAdd)
    newDiscord.save()
    resp = jsonify(newDiscord), 201
    return resp


def get_discords_get():
    discords = Discord().find_all()
    return {"discords_list": discords}


@app.route('/discords', methods=['GET', 'POST'])
def get_discords():
    if request.method == 'GET':
        return get_discords_get()
    elif request.method == 'POST':
        return get_discords_post(request.get_json())


def get_discord_patch(id, discord_to_update):
    discord_to_update["_id"] = ObjectId(id)
    new_discord = Discord(discord_to_update)
    new_discord.patch()
    resp = jsonify(new_discord), 201
    return resp


def get_discord_delete(id):
    discord = Discord({"_id": id})
    if discord.remove():
        resp = jsonify(), 204
        return resp
    return jsonify({"error": "Discord not found"}), 404


def get_discord_get(id):
    discord = Discord({"_id": id})
    if discord.reload():
        return discord
    else:
        return jsonify({"error": "Discord not found"}), 404


@app.route('/discords/<id>', methods=['GET', 'DELETE', 'PATCH'])
def get_discord(id):
    if request.method == 'GET':
        return get_discord_get(id)
    elif request.method == 'DELETE':
        return get_discord_delete(id)
    elif request.method == 'PATCH':
        return get_discord_patch(id, request.get_json())


def get_next_discord_get():
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


@app.route('/discords/next', methods=['GET'])
def get_next_discord():
    if request.method == 'GET':
        return get_next_discord_get()


def remove_group_from_all_queues(group):
    games_list = Game().find_all()
    removed = False
    for game in games_list:
        for lobby in game["queue"]:
            try:
                lobby["groups"].remove(group)
                removed = True
            except ValueError:
                pass
            if removed:
                lobby["num_players"] -= 1

    if removed:
        del group
    return removed


def leave_queue_patch(user_id):
    print("removing from queue")
    user = User({"_id": user_id})
    if user.reload():
        print(user['group'])
        print("user:", user)
        current_group = Group({"_id": user['group']})
        if current_group.reload():
            print("checking games")
            success = remove_group_from_all_queues(current_group)
            if success:
                return jsonify({"success": "User removed from queue"}), 204
            else:
                return jsonify({"error": "User's group not found in queues"}), 404
        else:
            return jsonify({"error": "User's group not found"}), 404


@app.route('/queue', methods=['PATCH'])
def leave_queue():
    if request.method == 'PATCH':
        return leave_queue_patch(request.args.get('user_id'))
    return jsonify({"error": "User not found"}), 404
