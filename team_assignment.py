from bson import ObjectId

from mongodb import Game, User
from suitable_lobby import get_team_combos
from itertools import combinations

def get_group_sizes(groups):
    """returns a list of of ints corresponding to the group sizes of the lobby"""
    group_sizes = []
    for group in groups:
        group_sizes.append(group["num_players"])
    return group_sizes

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

def calc_avg_team_elo(team, game_name):
    team_elo_sum = 0
    team_num_players = 0
    for group in team:
        team_num_players += group["num_players"]
        for player_id in group["players"].keys():
            user = User({"_id": player_id})
            if user.reload():
                team_elo_sum += user.games_table[game_name]['game_score']
    avg_team_elo = team_elo_sum/team_num_players
    return avg_team_elo

def match_elo_diff(match, game_name):
    """for each combination of 2 teams, calc the elo diff, then return the sum"""
    num_teams = len(match)
    team_elos = [None]*num_teams
    for i in range(len(match)):
        team_elos[i] = calc_avg_team_elo(match[i], game_name)
    match_elo_diff_sum = 0
    elo_diff_pairs = list(combinations(team_elos, 2))
    for diff_pair in elo_diff_pairs:
        elo_diff = abs(diff_pair[0] - diff_pair[1])
        match_elo_diff_sum += elo_diff
    return match_elo_diff_sum

def choose_best_match(all_matches, game_name):
    """input: all possible matches
    output: the match with minimum elo differential"""
    elo_diffs = [None] * len(all_matches)
    for i in range(0, len(all_matches)):
        match = all_matches[i]
        elo_diffs[i] = match_elo_diff(match, game_name)
    best_elo_index = elo_diffs.index(min(elo_diffs))
    return list(all_matches[best_elo_index])

def group_size(group):
    return group["num_players"]

def assign_teams(full_lobby, num_teams, players_per_team, game_name):
    full_lobby["groups"].sort(key=group_size)
    group_sizes = get_group_sizes(full_lobby["groups"])
    team_templates = get_team_combos(group_sizes, players_per_team)
    all_matches = find_all_matches(team_templates, full_lobby, num_teams)
    chosen_match = choose_best_match(all_matches, game_name)
    full_lobby["teams"] = chosen_match
