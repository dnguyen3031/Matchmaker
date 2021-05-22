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
    Each match is a list of <num_teams> team templates. Each team template is a list of group sizes.
    This function is recursive. It iterates over num_teams."""
    if num_teams == 1:
        return [group_sizes]
    match_templates = []
    team_combos = get_team_combos(group_sizes, players_per_team)
    for team_combo in team_combos:
        excluded_group_sizes = list(group_sizes)
        for group_size in team_combo:
            excluded_group_sizes.remove(group_size)
        remaining_team_combos = get_match_templates(excluded_group_sizes, players_per_team, num_teams-1)
        for remaining_team_combo in remaining_team_combos:
            potential_team_combo = [team_combo, remaining_team_combo]
            match_templates.append(potential_team_combo)
    return match_templates


def clean_duplicates(match_templates):

    pass


def find_teams_from_templates(match_templates, lobby):
    teams = []
    unused_groups = list(lobby["groups"])
    arbitrary_template = match_templates[0]
    print(match_templates[0])
    for team_template in arbitrary_template:
        curr_team = []
        for target_group_size in team_template:
            print("for each group of size", target_group_size)
            for group in unused_groups:
                print("checking all unused groups...")
                if group["num_players"] == target_group_size:
                    curr_team.append(group)
                    unused_groups.remove(group)
                    print("breaking")
                    break
        teams.append(curr_team)
    return teams



def choose_best_match(lobby, num_teams, players_per_team):
    """ input: the filled lobby
    return: a match of some teams"""
    pass

def assign_teams(full_lobby, num_teams, players_per_team):
    group_sizes = get_group_sizes(full_lobby["groups"])
    match_templates = get_match_templates(group_sizes, players_per_team, num_teams)
    clean_duplicates(match_templates)
    all_teams = find_teams_from_templates(match_templates, full_lobby)
    teams = choose_best_match(all_teams, players_per_team, num_teams)
    full_lobby["teams"] = teams