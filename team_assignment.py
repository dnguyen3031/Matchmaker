from mongodb import Game
from suitable_lobby import get_team_combos

def get_group_sizes(groups):
    """returns a list of of ints corresponding to the group sizes of the lobby"""
    group_sizes = []
    for group in groups:
        group_sizes.append(group["num_players"])
    return group_sizes

def group_sizes_excluding_team(group_sizes, team):
    other_group_sizes = list(group_sizes)
    for group_size in team:
        other_group_sizes.remove(group_size)
    return other_group_sizes

def join_team_to_all_matches(team, matches):
    viable_matches = []
    for match in matches:
        viable_matches.append([team] + match)
    return viable_matches

def filter_teams(teams, blocklist):
    i = 0
    while i < len(teams):
        if teams[i] in blocklist:
            teams.pop(i)
            i -= 1
        i += 1

def get_match_templates(group_sizes, players_per_team, num_teams, blocklist=None):
    """input: a list of possible group sizes
    return: a list of the different matches that fit the group sizes into different teams.
    Each match is a list of <num_teams> teams. Each team is a list of group sizes.
    For clarity, the list order is matches, teams, group_sizes
    return [] if the only possible teams are in the blocklist
    This function is recursive. It iterates over num_teams."""
    if blocklist is None:
        blocklist = []
    if num_teams == 1:
        if group_sizes not in blocklist:
            return [[group_sizes]]
        else:
            return []
    match_templates = []
    possible_teams = get_team_combos(group_sizes, players_per_team)
    filter_teams(possible_teams, blocklist)
    for team in possible_teams:
        other_group_sizes = group_sizes_excluding_team(group_sizes, team)
        remaining_match_templates = get_match_templates(
            other_group_sizes, players_per_team, num_teams-1, list(blocklist))
        if len(remaining_match_templates) > 0:
            viable_matches = join_team_to_all_matches(team, remaining_match_templates)
            match_templates += viable_matches
        blocklist.append(team)
    return match_templates

def find_all_matches_with_template(match_template, lobby):
    matches = []
    for team_template in match_template:
        curr_team = []
        for target_group_size in team_template:
            print("for each group of size", target_group_size)
            for group in lobby:
                print("checking all unused groups...")
                if group["num_players"] == target_group_size:
                    curr_team.append(group)
                    lobby.remove(group)
                    print("breaking")
                    break
        matches.append(curr_team)
    return matches

def find_all_matches(match_templates, lobby):
    matches = []
    for match_template in match_templates:
        lobby_copy = list(lobby["groups"])
        matches += find_all_matches_with_template(match_template, lobby_copy)
    return matches

def choose_best_match(all_matches):
    """ input: the filled lobby
    return: a match of some teams"""
    pass

def group_size(group):
    return group["num_players"]

def assign_teams(full_lobby, num_teams, players_per_team):
    full_lobby["groups"].sort(key=group_size)
    group_sizes = get_group_sizes(full_lobby["groups"])
    match_templates = get_match_templates(group_sizes, players_per_team, num_teams)
    all_matches = find_all_matches(match_templates, full_lobby)
    chosen_match = choose_best_match(all_matches)
    full_lobby["teams"] = chosen_match