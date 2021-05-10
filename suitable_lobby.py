def too_many_players(lobby, o_lobby, num_players_needed):
    if lobby["num_players"] + o_lobby["num_players"] > num_players_needed:
        return True
    else:
        return False


def get_group_sizes(lobby, o_lobby):
    """returns a sorted list of of ints corresponding to the group sizes of each group in both lobbies"""
    group_sizes = []
    for group in lobby["groups"]:
        group_sizes.append(group["num_players"])
    for group in o_lobby["groups"]:
        group_sizes.append(group["num_players"])
    group_sizes.sort()
    return group_sizes


def init_group_matrix(group_sizes, players_per_team):
    """matrix[group][team_size]"""
    # ToDo: simplify this def
    matrix = [[None for m in range(players_per_team + 1)] for m in range(len(group_sizes) + 1)]
    for i in range(len(group_sizes) + 1):
        # fitting match size of 0 is always possible - use empty list
        matrix[i][0] = [[]]
    for i in range(players_per_team + 1):
        # matching without any players (using 0 or fewer) is always impossible
        matrix[0][i] = None
    return matrix


def append_or_create(matrix, i, j, appended_item):
    """appends appended_item to matrix[i][j], provided appended_item doesn't already exist in matrix[i][j].
     If matrix[i][j] doesn't exist, create it and append the item."""
    if matrix[i][j] is None:
        matrix[i][j] = [appended_item]
    else:
        dupe = False
        for present_item in matrix[i][j]:
            if present_item == appended_item:
                dupe = True
                break
        if not dupe:
            matrix[i][j].append(appended_item)


def get_team_combos(group_sizes, players_per_team):
    """Returns all possible ways to form a team of size "players_per_team" from the list of group sizes.
    Uses dynamic programming. Each cell m[i][j] contains a list of lists with possible combinations of group sizes
    used to form a team of j members, using only groups whose index <= i.
     If it is impossible to form a team, the cell holds None"""
    # print("---calling with gs: "+str(group_sizes)+" and ppt: "+str(players_per_team)+" ---")
    matrix = init_group_matrix(group_sizes, players_per_team)
    for i in range(1, len(group_sizes) + 1):
        for j in range(1, players_per_team + 1):
            group_size = group_sizes[i - 1]
            if matrix[i - 1][j] is not None:  # worked with prev groups, so repeat here.
                for team in matrix[i - 1][j]:
                    append_or_create(matrix, i, j, list(team))
            # for group in matrix:
            # print(group)
            if group_size == j:
                # exact match
                append_or_create(matrix, i, j, [group_size])
            elif group_size < j:
                space_to_add = j - group_size
                if matrix[i - 1][space_to_add] is not None:
                    for team in matrix[i - 1][space_to_add]:
                        combined_team = list(team)
                        combined_team.append(group_size)
                        append_or_create(matrix, i, j, combined_team)
    return matrix[len(group_sizes)][players_per_team]


def add_singles(group_sizes, players_per_game):
    while sum(group_sizes) < players_per_game:
        group_sizes.append(1)


def check_groups_splittable(group_sizes, num_teams, players_per_team):
    """ Given: the sum of the elements of group_sizes <= players_per_game
    AND there are the same number of players on each team
    Return: True if the groups can be split into the given number of teams, False otherwise.
    This is a recursive function that iterates by "trying" a new team at each recursion."""
    if num_teams == 0:
        return True
    players_per_game = num_teams * players_per_team
    if sum(group_sizes) < players_per_game:
        # sometimes teams will be unfilled-
        # here, we assume the best case (all singletons) and see if formation is still possible
        add_singles(group_sizes, players_per_game)
    possible_teams = get_team_combos(group_sizes, players_per_team)
    if possible_teams is not None:
        for team in possible_teams:
            group_sizes_copy = list(group_sizes)
            for group in team:
                group_sizes_copy.remove(group)
            if check_groups_splittable(group_sizes_copy, num_teams - 1, players_per_team):
                # If we make possible_team, is is still possible to make other teams?
                return True
    return False


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
            players_per_team = game["num_players"] // game["num_teams"]  # guaranteed to be divisible
            # there is potential for a group error- being unable to make teams from the given groups
            if check_groups_splittable(get_group_sizes(lobby, o_lobby), game["num_teams"], players_per_team):
                return o_lobby
    return None
