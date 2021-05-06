from itertools import combinations

def space_to_add_players(lobby, o_lobby, num_players_needed):
    if lobby["num_players"] + o_lobby["num_players"] < num_players_needed:
        return True
    else:
        return False

def too_many_players(lobby, o_lobby, num_players_needed):
    if lobby["num_players"] + o_lobby["num_players"] > num_players_needed:
        return True
    else:
        return False

def get_group_sizes(lobby, o_lobby):
    """returns a sorted list of of ints corresponding to the group sizes of each group in both lobbies"""
    group_sizes = []
    for group in lobby:
        group_sizes.append(group["num_players"])
    for group in o_lobby:
        group_sizes.append(group["num_players"])
    group_sizes.sort(reverse=True)
    return group_sizes

def check_groups_splittable(group_sizes, num_teams, players_per_game):
    """ Given: the sum of the elements of group_sizes == players_per_game
    returns True if the groups can be split into the given number of teams, False otherwise"""
    players_per_team = players_per_game/num_teams
    #coin change algorithm, trying to reach players_per_team amnt of change


def within_range(lobby, o_lobby):
    higher_lobby = o_lobby
    lower_lobby = lobby
    if lobby["avg_elo"] > o_lobby["avg_elo"]:
        higher_lobby = lobby
        lower_lobby = o_lobby

    l_lobby_upper_bound = lower_lobby["avg_elo"] + lower_lobby["window_size"]
    h_lobby_lower_bound = higher_lobby["avg_elo"] - higher_lobby["window_size"]

    if l_lobby_upper_bound >= higher_lobby["avg_elo"] and h_lobby_lower_bound <= lower_lobby["avg_elo"]:
        return True
    return False


def find_suitable(game, lobby):
    """finds a suitable lobby for the given lobby"""
    for o_lobby in game["queue"]:
        if o_lobby != lobby \
        and within_range(lobby, o_lobby) \
        and (not too_many_players(lobby, o_lobby, game["num_players"])):
            if space_to_add_players(lobby, o_lobby, game["num_players"]):
                return o_lobby
            elif check_groups_splittable(get_group_sizes(lobby, o_lobby), game["num_teams"], game["num_players"]):
                #since the number of players in the new lobby will be a full game, there is potential for a group error
                return o_lobby
    return None