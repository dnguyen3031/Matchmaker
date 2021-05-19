from mongodb import Game
from suitable_lobby import get_team_combos

def get_group_sizes(groups):
    """returns a sorted list of of ints corresponding to the group sizes of the lobby"""
    group_sizes = []
    for group in groups:
        group_sizes.append(group["num_players"])
    group_sizes.sort()
    return group_sizes

def get_match_templates(group_sizes, players_per_team, num_teams):
    """input: a list of possible group sizes
    return: a list of the different matches that fit the group sizes into different teams.
    Each match is a list of 2 team templates. Each team template is a list of group sizes"""
    match_templates = []
    combos = get_team_combos(group_sizes, players_per_team)
    for combo in combos:
        pass
    return []
def find_all_possible_matchups(lobby):
    """ input: the filled lobby
    return: a list containing all possible teams, each containing the id of each of the players of those teams """
    group_sizes = get_group_sizes(lobby["groups"])
    match_templates = get_match_templates(group_sizes)
    return []

def assign_teams(full_lobby):
    game = Game({"_id": full_lobby["game_id"]})
    game.reload()
    teams = find_all_possible_matchups(full_lobby)
    full_lobby["teams"] = teams