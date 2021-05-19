def expected_win_prob(plr_rating, opp_rating):
    scale_factor = 400
    return 1 / (1 + 10 ** ((opp_rating - plr_rating) / scale_factor))


def new_elo(plr_rating, exp_win, plr_win):
    k = 32
    plr_rating += k * (plr_win - exp_win)
    return round(plr_rating, 0)


def calc_elo(plr_rating, opp_rating, plr_win):
    exp_win = expected_win_prob(plr_rating, opp_rating)
    return new_elo(plr_rating, exp_win, plr_win)
