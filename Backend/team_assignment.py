from mongodb import Game
from suitable_lobby import get_team_combos
def get_group_sizes(lobby):
    """returns a sorted list of of ints corresponding to the group sizes of the lobby"""
    group_sizes = []
    for group in lobby:
        group_sizes.append(group["num_players"])
    group_sizes.sort()
    return group_sizes

def largest_group(unused_groups):
    largest_group = 0
    for i in range(len(unused_groups)):
        if len(unused_groups[i]["players"].keys()) > len(unused_groups[largest_group]["players"].keys()):
            largest_group = i
    return unused_groups.pop(largest_group)

def get_match_combo_sizes():
    """return a list of the different ways to fit the sizes into different teams"""
    if num_teams == 0:
        return None
    return []
def find_best_teams(groups):
    """return: a list containing the best teams, each formatted as a proper json"""
    matches = get_match_combo_sizes()
    return []

def assign_teams(full_lobby):
    game = Game({"_id": full_lobby["game_id"]})
    game.reload()
    teams = find_best_teams(full_lobby["groups"])
    full_lobby["teams"] = teams


"""
def find_best_teams(groups):
    team1, team2 = {"size": 0, "groups": []}, {"size": 0, "groups": []}
    unused_groups = [] + groups
    for i in range(len(groups)):
        if team1["size"] > team2["size"]:
            temp = largest_group(unused_groups)
            team2["groups"] += [temp]
            team2["size"] += len(temp["players"].keys())
        else:
            temp = largest_group(unused_groups)
            team1["groups"] += [temp]
            team1["size"] += len(temp["players"].keys())
    return team1["groups"], team2["groups"]
"""