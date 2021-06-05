from bson import ObjectId

from ELO import calc_elo
from mongodb import User, Game, Discord, Lobby


def assign_team_elo(team, team_info, oppenent_info, game_name):
    win = team_info["votes"].index(max(team_info["votes"])) - oppenent_info["votes"].index(max(oppenent_info["votes"]))
    if win > 0:
        win = 1
    elif win < 0:
        win = 0
    else:
        win = 0.5

    elo_change = int(team_info["adv_elo"]) - calc_elo(int(team_info["adv_elo"]), int(oppenent_info["adv_elo"]),
                                                      float(win))
    for group in team:
        for player_id in group["players"].keys():
            user = User({"_id": player_id})
            user.reload()
            user["_id"] = ObjectId(user["_id"])
            user["games_table"][game_name]["game_score"] += elo_change
            user.save()

def team_won(lobby):
    num_teams = len(lobby["teams"])
    is_over = True
    for i in range(num_teams):
        got_votes = False
        for place in lobby["team_info"][i]["votes"]:
            if place > lobby["num_players"] / num_teams:
                got_votes = True
        if not got_votes:
            is_over = False
    return is_over

def compare_other_teams(team, team_info, teams_info, game_name):
    for opponent_info in teams_info:
        assign_team_elo(team, team_info, opponent_info, game_name)

def assign_elos(lobby):
    game = Game({"_id": lobby["game_id"]})
    game.reload()
    for i in range(len(lobby["teams"])):
        compare_other_teams(lobby["teams"][i], lobby["team_info"][i], lobby["team_info"], game["game_name"])

def free_discord(room_name):
    if not room_name == "all rooms taken":
        dis = Discord().find_by_name(room_name)[0]
        discord = Discord({"_id": dis["_id"]})
        discord["_id"] = ObjectId(discord["_id"])
        discord["status"] = "open"
        discord.patch()

def unqueue_players(teams):
    for team in teams:
        for group in team:
            for player_id in group["players"].keys():
                user = User({"_id": player_id})
                user["_id"] = ObjectId(user["_id"])
                user["in_queue"] = False
                user["has_voted"] = False
                user["lobby"] = None
                user.patch()

def terminate_lobby(lobby):
    free_discord(lobby["discord"])
    assign_elos(lobby)
    unqueue_players(lobby["teams"])
    lob = Lobby({"_id": lobby["_id"]})
    lob.remove()

def is_over(lob):
    game = Game({"_id": lob["game_id"]})
    game.reload()
    lobby = Lobby({"_id": lob["_id"]})
    lobby.reload()
    lobby["_id"] = ObjectId(lobby["_id"])
    lobby["time_left"] = 86400 * 0.0001 ** (lobby["total_votes"] / lobby["num_players"]) + game["avg_length"] - lobby[
        "time_elapsed"]
    lobby.save()
    return team_won(lobby) or 0 > lobby["time_left"]  # one day = 86400

def check_for_end_match(lobbies):
    for lobby in lobbies:
        if is_over(lobby):
            terminate_lobby(lobby)