import unittest
from team_assignment import *

def simplify_teams(teams):
    """for simplifying testing output. Turns a full json of teams into a simplified list representation"""
    teams_names  = []
    for team in teams:
        team_names = []
        for group in team:
            players = []
            for player_key in group["players"].keys():
                players.append(group["players"][player_key])
            team_names.append(players)
        teams_names.append(team_names)
    return teams_names

def simplify_matches(matches):
    """for simplifying testing output. Turns a combination iterable of matches into a simplified list representation"""
    simple_matches  = []
    for match in matches:
        simple_matches.append(simplify_teams(match))
    return simple_matches

def jsonify_group(simple_groups):
    """for simplifying testing input. Turns a simplified list representation of groups into a list of group jsons"""
    arbitrary_increment = 2
    key = 0
    groups = []
    for simple_group in simple_groups:
        group = {"players": {}, "num_players": len(simple_group), "id":str(key+1)}
        for player in simple_group:
            key += arbitrary_increment
            group["players"][str(key)] = player
        groups.append(group)
    return groups

class MyTestCase(unittest.TestCase):

    def test_find_teams_with_template_actual_groups(self):
        groups =  [
                {
                    "_id": "609719c646fabbf5e1931578",
                    "num_players": 1,
                    "players": {
                        "6024098ac9b27e9f9995df97": "mikescott0808",
                    }
                },
                {
                    "_id": "609716516baf12b180e1a95c",
                    "num_players": 1,
                    "players": {
                        "6024098ac9b27e9f9995df97": "alexd1214",
                    }
                },
                {
                    "_id": "609cc564b0105c43e02ba04f",
                    "num_players": 2,
                    "players": {
                        "6024098ac9b27e9f9995df97": "template",
                        "607228229a8f71adf99cbfbe": "max"
                    }
                },
                {
                    "_id": "60a1861c2d951ae021f05d60",
                    "num_players": 2,
                    "players": {
                        "60a5f2fa05f1815bd50e4522": "braden",
                        "60a5fec405f1815bd50e452b": "sadfasfas"
                    }
                },
                {
                    "_id": "60a1861c2d951ae021f05d64",
                    "num_players": 2,
                    "players": {
                        "60a5f2fa05f1815bd50e4522": "hayden",
                        "60a5fec405f1815bd50e452b": "dad"
                    }
                }
        ]
        template = [1,1,2]
        teams = find_all_teams_with_template(template, groups)
        teams_names = simplify_teams(teams)
        self.assertEqual(teams_names,
                         [[["mikescott0808"], ["alexd1214"], ["template", "max"]],
                          [["mikescott0808"], ["alexd1214"], ["braden", "sadfasfas"]],
                          [["mikescott0808"], ["alexd1214"], ["hayden", "dad"]]] )

    def test_find_teams_with_template_1(self):
        simple_groups = [["mikeScott0808"], ["alexd1214"],
                         ["template", "max"], ["braden", "sadfasfas"], ["hayden", "dad"]]
        groups = jsonify_group(simple_groups)
        template = [1,1,2]
        teams = find_all_teams_with_template(template, groups)
        teams_names = simplify_teams(teams)
        self.assertEqual(teams_names,
                         [[["mikeScott0808"], ["alexd1214"], ["template", "max"]],
                          [["mikeScott0808"], ["alexd1214"], ["braden", "sadfasfas"]],
                          [["mikeScott0808"], ["alexd1214"], ["hayden", "dad"]]] )

    def test_find_teams_with_template_2(self):
        simple_groups = [["mike"], ["alex"],
                         ["template", "max"], ["braden", "sadfas"], ["hayden", "dad"]]
        groups = jsonify_group(simple_groups)
        template = [2,2]
        teams = find_all_teams_with_template(template, groups)
        teams_names = simplify_teams(teams)
        self.assertEqual(teams_names,
                         [[["template", "max"], ["braden", "sadfas"]],
                          [["template", "max"], ["hayden", "dad"]],
                          [["braden", "sadfas"], ["hayden", "dad"]]])


    def test_find_teams_with_template_3(self):
        simple_groups = [["mike"], ["alex"], ["brad"], ["bill"],
                         ["template", "max"], ["braden", "sadfas"], ["hayden", "dad"], ["bro", "bob"]]
        groups = jsonify_group(simple_groups)
        template = [1,1,2,2]
        teams = find_all_teams_with_template(template, groups)
        teams_names = simplify_teams(teams)
        self.assertEqual(teams_names,
                         [[['mike'], ['alex'], ['template', 'max'], ['braden', 'sadfas']],
                          [['mike'], ['alex'], ['template', 'max'], ['hayden', 'dad']],
                          [['mike'], ['alex'], ['template', 'max'], ['bro', 'bob']],
                          [['mike'], ['alex'], ['braden', 'sadfas'], ['hayden', 'dad']],
                          [['mike'], ['alex'], ['braden', 'sadfas'], ['bro', 'bob']],
                          [['mike'], ['alex'], ['hayden', 'dad'], ['bro', 'bob']],
                          [['mike'], ['brad'], ['template', 'max'], ['braden', 'sadfas']],
                          [['mike'], ['brad'], ['template', 'max'], ['hayden', 'dad']],
                          [['mike'], ['brad'], ['template', 'max'], ['bro', 'bob']],
                          [['mike'], ['brad'], ['braden', 'sadfas'], ['hayden', 'dad']],
                          [['mike'], ['brad'], ['braden', 'sadfas'], ['bro', 'bob']],
                          [['mike'], ['brad'], ['hayden', 'dad'], ['bro', 'bob']],
                          [['mike'], ['bill'], ['template', 'max'], ['braden', 'sadfas']],
                          [['mike'], ['bill'], ['template', 'max'], ['hayden', 'dad']],
                          [['mike'], ['bill'], ['template', 'max'], ['bro', 'bob']],
                          [['mike'], ['bill'], ['braden', 'sadfas'], ['hayden', 'dad']],
                          [['mike'], ['bill'], ['braden', 'sadfas'], ['bro', 'bob']],
                          [['mike'], ['bill'], ['hayden', 'dad'], ['bro', 'bob']],
                          [['alex'], ['brad'], ['template', 'max'], ['braden', 'sadfas']],
                          [['alex'], ['brad'], ['template', 'max'], ['hayden', 'dad']],
                          [['alex'], ['brad'], ['template', 'max'], ['bro', 'bob']],
                          [['alex'], ['brad'], ['braden', 'sadfas'], ['hayden', 'dad']],
                          [['alex'], ['brad'], ['braden', 'sadfas'], ['bro', 'bob']],
                          [['alex'], ['brad'], ['hayden', 'dad'], ['bro', 'bob']],
                          [['alex'], ['bill'], ['template', 'max'], ['braden', 'sadfas']],
                          [['alex'], ['bill'], ['template', 'max'], ['hayden', 'dad']],
                          [['alex'], ['bill'], ['template', 'max'], ['bro', 'bob']],
                          [['alex'], ['bill'], ['braden', 'sadfas'], ['hayden', 'dad']],
                          [['alex'], ['bill'], ['braden', 'sadfas'], ['bro', 'bob']],
                          [['alex'], ['bill'], ['hayden', 'dad'], ['bro', 'bob']],
                          [['brad'], ['bill'], ['template', 'max'], ['braden', 'sadfas']],
                          [['brad'], ['bill'], ['template', 'max'], ['hayden', 'dad']],
                          [['brad'], ['bill'], ['template', 'max'], ['bro', 'bob']],
                          [['brad'], ['bill'], ['braden', 'sadfas'], ['hayden', 'dad']],
                          [['brad'], ['bill'], ['braden', 'sadfas'], ['bro', 'bob']],
                          [['brad'], ['bill'], ['hayden', 'dad'], ['bro', 'bob']]])

    def test_find_all_matches_1(self):
        team_templates = [[1, 2], [1,1,1]]
        lobby  = {"groups": jsonify_group([["mike"], ["alex"], ["brad"], ["bill"], ["template", "max"]])}
        all_matches = find_all_matches(team_templates, lobby, 2)
        # for match in all_matches:
        #     print(match)
        simple_matches = simplify_matches(all_matches)
        self.assertEqual(simple_matches ,
                         [[[['mike'], ['template', 'max']], [['alex'], ['brad'], ['bill']]],
                          [[['alex'], ['template', 'max']], [['mike'], ['brad'], ['bill']]],
                          [[['brad'], ['template', 'max']], [['mike'], ['alex'], ['bill']]],
                          [[['bill'], ['template', 'max']], [['mike'], ['alex'], ['brad']]]]
                         )

    def test_find_all_matches_2(self):
        team_templates = [[1, 1, 1, 1], [1,1,2], [2,2]]
        lobby  = {"groups": jsonify_group([["mike"], ["alex"], ["brad"], ["bill"], ["template", "max"], ["bro", "bob"]])}
        all_matches = find_all_matches(team_templates, lobby, 2)
        # for match in all_matches:
        #     print(match)
        simple_matches = simplify_matches(all_matches)
        self.assertEqual(simple_matches ,
            [[[['mike'], ['alex'], ['brad'], ['bill']],
              [['template', 'max'], ['bro', 'bob']]],
             [[['mike'], ['alex'], ['template', 'max']],
              [['brad'], ['bill'], ['bro', 'bob']]],
             [[['mike'], ['alex'], ['bro', 'bob']],
              [['brad'], ['bill'], ['template', 'max']]],
             [[['mike'], ['brad'], ['template', 'max']],
              [['alex'], ['bill'], ['bro', 'bob']]],
             [[['mike'], ['brad'], ['bro', 'bob']],
              [['alex'], ['bill'], ['template', 'max']]],
             [[['mike'], ['bill'], ['template', 'max']],
              [['alex'], ['brad'], ['bro', 'bob']]],
             [[['mike'], ['bill'], ['bro', 'bob']],
              [['alex'], ['brad'], ['template', 'max']]]]
        )
    def test_find_all_matches_3(self):
        team_templates = [[1, 1], [2]]
        lobby  = {"groups": jsonify_group([["mike"], ["alex"], ["brad"], ["bill"], ["template", "max"]])}
        all_matches = find_all_matches(team_templates, lobby, 3)
        print(all_matches)
        simple_matches = simplify_matches(all_matches)
        self.assertEqual(simple_matches ,
            [[[['mike'], ['alex']], [['brad'], ['bill']], [['template', 'max']]],
             [[['mike'], ['brad']], [['alex'], ['bill']], [['template', 'max']]],
             [[['mike'], ['bill']], [['alex'], ['brad']], [['template', 'max']]]]
        )

    def test_find_all_matches_4(self):
        team_templates = [[1, 1], [2]]
        lobby  = {"groups": jsonify_group([["mike"], ["alex"], ["template", "max"], ["bro", "bob"]])}
        all_matches = find_all_matches(team_templates, lobby, 3)
        # for match in all_matches:
        #     print(match)
        simple_matches = simplify_matches(all_matches)
        self.assertEqual(simple_matches ,
            [[[['mike'], ['alex']], [['template', 'max']], [['bro', 'bob']]]]
        )

    def test_calc_avg_team_elo(self):
        team = [
                {
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df97",
                    "num_players": 1,
                    "players": {
                        "60aae8e8cdcc669e1ee3ad26": "test02"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df98",
                    "num_players": 1,
                    "players": {
                        "60aae902b71566470d3e855e": "test03"
                    }
                },
                {
                    "_id": "60a5f2fa05f1815bd50e4522",
                    "num_players": 1,
                    "players": {
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                }
        ]
        team_elo = calc_avg_team_elo(team, "Krunker - Hardpoint")
        self.assertEqual(team_elo, 996.5)

    def test_match_elo_diff_1(self):
        match = [
                [{
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df97",
                    "num_players": 1,
                    "players": {
                        "60aae8e8cdcc669e1ee3ad26": "test02"
                    }
                }],
                [{
                    "_id": "6024098ac9b27e9f9995df98",
                    "num_players": 1,
                    "players": {
                        "60aae902b71566470d3e855e": "test03"
                    }
                },
                {
                    "_id": "60a5f2fa05f1815bd50e4522",
                    "num_players": 1,
                    "players": {
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                }]
            ]
        match_diff = match_elo_diff(match,"Krunker - Hardpoint")
        self.assertEqual(match_diff, 1)

    def test_match_elo_diff_2(self):
        match = [
                [{
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df97",
                    "num_players": 1,
                    "players": {
                        "60aae8e8cdcc669e1ee3ad26": "test02"
                    }
                }],
                [{
                    "_id": "60b56a5c43a9b10d4ae5a730",
                    "num_players": 1,
                    "players": {
                        "60b56a5c43a9b10d2ae5a737": "test05"
                    }
                },
                {
                    "_id": "60aae916cdcc669e1ee1ad37",
                    "num_players": 1,
                    "players": {
                        "60b56a7743a9b10d2ae5a738": "test06"
                    }
                }],
                [{
                    "_id": "6024098ac9b27e9f9995df38",
                    "num_players": 2,
                    "players": {
                        "60aae902b71566470d3e855e": "test03",
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                }]
            ]
        match_diff = match_elo_diff(match,"Krunker - Hardpoint")
        self.assertEqual(match_diff, 594.0)

    def test_choose_best_match(self):
        matches = [
            [
                [{
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df97",
                    "num_players": 1,
                    "players": {
                        "60aae8e8cdcc669e1ee3ad26": "test02"
                    }
                }],
                [{
                    "_id": "6024098ac9b27e9f9995df98",
                    "num_players": 1,
                    "players": {
                        "60aae902b71566470d3e855e": "test03"
                    }
                },
                {
                    "_id": "60a5f2fa05f1815bd50e4522",
                    "num_players": 1,
                    "players": {
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                }]
            ],
            [
                [{
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df98",
                    "num_players": 1,
                    "players": {
                        "60aae902b71566470d3e855e": "test03"
                    }
                }],
                [{
                    "_id": "60a5f2fa05f1815bd50e4522",
                    "num_players": 1,
                    "players": {
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                },
                    {
                        "_id": "6024098ac9b27e9f9995df97",
                        "num_players": 1,
                        "players": {
                            "60aae8e8cdcc669e1ee3ad26": "test02"
                        }
                    }
                ]
            ],
            [
                [{
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "60a5f2fa05f1815bd50e4522",
                    "num_players": 1,
                    "players": {
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                }],
                [{
                    "_id": "6024098ac9b27e9f9995df98",
                    "num_players": 1,
                    "players": {
                        "60aae902b71566470d3e855e": "test03"
                    }
                },
                    {
                        "_id": "6024098ac9b27e9f9995df97",
                        "num_players": 1,
                        "players": {
                            "60aae8e8cdcc669e1ee3ad26": "test02"
                        }
                    }
                ]
            ]
        ]
        best_match = choose_best_match(matches, "Krunker - Hardpoint")
        self.assertEqual(best_match, [
            [{'_id': '6024098ac9b27e9f9995df90',
               'num_players': 1,
               'players': {'60aae8d3b71566470d3e855d': 'test01'}},
              {'_id': '6024098ac9b27e9f9995df97',
               'num_players': 1,
               'players': {'60aae8e8cdcc669e1ee3ad26': 'test02'}}],
             [{'_id': '6024098ac9b27e9f9995df98',
               'num_players': 1,
               'players': {'60aae902b71566470d3e855e': 'test03'}},
              {'_id': '60a5f2fa05f1815bd50e4522',
               'num_players': 1,
               'players': {'60aae916cdcc669e1ee3ad27': 'test04'}}]
            ])

    def test_assign_teams_1(self):
        full_lobby = {}
        full_lobby["groups"] = [
                {
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df97",
                    "num_players": 1,
                    "players": {
                        "60aae8e8cdcc669e1ee3ad26": "test02"
                    }
                },
                {
                    "_id": "60b56a5c43a9b10d4ae5a730",
                    "num_players": 1,
                    "players": {
                        "60aae902b71566470d3e855e": "test03",
                    }
                },
                {
                    "_id": "60aae916cdcc669e1ee1ad37",
                    "num_players": 1,
                    "players": {
                        "60b56a7743a9b10d2ae5a738": "test06"
                    }
                }
            ]
        assign_teams(full_lobby, 2, 2, "Krunker - Hardpoint")
        self.assertEqual(full_lobby["teams"],
            [[{'_id': '6024098ac9b27e9f9995df90',
               'num_players': 1,
               'players': {'60aae8d3b71566470d3e855d': 'test01'}},
              {'_id': '60b56a5c43a9b10d4ae5a730',
               'num_players': 1,
               'players': {'60aae902b71566470d3e855e': 'test03'}}],
             [{'_id': '6024098ac9b27e9f9995df97',
               'num_players': 1,
               'players': {'60aae8e8cdcc669e1ee3ad26': 'test02'}},
              {'_id': '60aae916cdcc669e1ee1ad37',
               'num_players': 1,
               'players': {'60b56a7743a9b10d2ae5a738': 'test06'}}]]
        )

    def test_assign_teams_2(self):
        full_lobby = {}
        full_lobby["groups"] = [
                {
                    "_id": "6024098ac9b27e9f9995df90",
                    "num_players": 1,
                    "players": {
                        "60aae8d3b71566470d3e855d": "test01"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df97",
                    "num_players": 1,
                    "players": {
                        "60aae8e8cdcc669e1ee3ad26": "test02"
                    }
                },
                {
                    "_id": "60b56a5c43a9b10d4ae5a730",
                    "num_players": 1,
                    "players": {
                        "60b56a5c43a9b10d2ae5a737": "test05"
                    }
                },
                {
                    "_id": "60aae916cdcc669e1ee1ad37",
                    "num_players": 1,
                    "players": {
                        "60b56a7743a9b10d2ae5a738": "test06"
                    }
                },
                {
                    "_id": "6024098ac9b27e9f9995df38",
                    "num_players": 2,
                    "players": {
                        "60aae902b71566470d3e855e": "test03",
                        "60aae916cdcc669e1ee3ad27": "test04"
                    }
                }
            ]
        assign_teams(full_lobby, 3, 2, "Krunker - Hardpoint")
        self.assertEqual(full_lobby["teams"],
            [[{'_id': '6024098ac9b27e9f9995df90',
               'num_players': 1,
               'players': {'60aae8d3b71566470d3e855d': 'test01'}},
              {'_id': '60aae916cdcc669e1ee1ad37',
               'num_players': 1,
               'players': {'60b56a7743a9b10d2ae5a738': 'test06'}}],
             [{'_id': '6024098ac9b27e9f9995df97',
               'num_players': 1,
               'players': {'60aae8e8cdcc669e1ee3ad26': 'test02'}},
              {'_id': '60b56a5c43a9b10d4ae5a730',
               'num_players': 1,
               'players': {'60b56a5c43a9b10d2ae5a737': 'test05'}}],
             [{'_id': '6024098ac9b27e9f9995df38',
               'num_players': 2,
               'players': {'60aae902b71566470d3e855e': 'test03',
               '60aae916cdcc669e1ee3ad27': 'test04'}}]]


        )

if __name__ == "__main__":
    unittest.main()
