from mongodb import Game
from suitable_lobby import get_team_combos
from itertools import combinations

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

def find_all_groups_with_size(target_group_size, lobby):
    groups_with_size = []
    for group in lobby:
        if group["num_players"] == target_group_size:
            groups_with_size.append(group)
    return groups_with_size

def make_team(group, rest_of_team):
    possible_team = [group]
    for other_group in rest_of_team:
        possible_team.append(other_group)
    return possible_team

def find_all_teams_with_template(team_template, groups):
    """recursively builds teams with the given template. Does not modify groups"""
    if len(team_template) == 0:
        return [[]]
    teams = []
    target_group_size = team_template[0]
    group_candidates = find_all_groups_with_size(target_group_size, groups)
    groups_copy = list(groups)
    while len(group_candidates) > 0:
        group = group_candidates[0]
        remaining_template = list(team_template)
        remaining_template.remove(target_group_size)
        remaining_groups = list(groups_copy)
        remaining_groups.remove(group)
        rest_of_team_possibilities = find_all_teams_with_template(remaining_template, remaining_groups)
        for rest_of_team in rest_of_team_possibilities:
            possible_team = make_team(group, rest_of_team)
            teams.append(possible_team)
        group_candidates.remove(group)
        groups_copy.remove(group)
    return teams

def find_all_teams(team_templates, groups):
    teams = []
    for team_template in team_templates:
        teams += find_all_teams_with_template(team_template, groups)
    return teams

def print_team(team):
    for group in team:
        print(group["players"], end="")
    print()

def print_teams(teams):
    for team in teams:
        print(" [", end ="")
        for group in team:
            print(group["players"], end="")
        print("] ", end ="")
    print()

def clean_self_vs_self(matches):
    """removes matches where a player is on multiple opposing teams"""
    i = 0
    while i < len(matches):
        for team in matches[i]:
            found_dup = False
            other_teams = list(matches[i])
            other_teams.remove(team)
            for group in team:
                for other_team in other_teams:
                    if group in other_team:
                        del matches[i]
                        i -= 1
                        found_dup = True
                        break
                if found_dup:
                    break
            if found_dup:
                break
        i += 1

def find_all_matches(team_templates, lobby, num_teams):
    teams = find_all_teams(team_templates, lobby["groups"])
    matches = list(combinations(teams, num_teams))
    clean_self_vs_self(matches)
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
    team_templates = get_team_combos(group_sizes, players_per_team)
    all_matches = find_all_matches(team_templates, full_lobby, num_teams)
    chosen_match = choose_best_match(all_matches)
    full_lobby["teams"] = chosen_match
