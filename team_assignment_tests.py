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

    def test_get_match_templates_1(self):
        groups = [1,1,1,1,2,2]
        t = get_match_templates(groups, 4, 2)
        self.assertEqual(t, [[[1,1,1,1], [2,2]],
                             [[1,1,2], [1,1,2]]])

    def test_get_match_templates_2(self):
        groups = [1,1,1,1,1,2,2,2,3,4]
        t = get_match_templates(groups, 6, 3)
        self.assertEqual(t,
                         [[[1, 1, 1, 1, 2], [1, 2, 3], [2, 4]],
                          [[1, 1, 2, 2], [1, 1, 1, 3], [2, 4]],
                          [[1, 1, 2, 2], [1, 2, 3], [1, 1, 4]],
                          [[2, 2, 2], [1, 1, 1, 3], [1, 1, 4]]])

    def test_get_match_templates_3(self):
        groups = [1,1,1,1,1,2,2,3,4,4]
        t = get_match_templates(groups, 4, 5)
        self.assertEqual(t,
                         [[[1, 1, 1, 1], [2, 2], [1, 3], [4], [4]],
                          [[1, 1, 2], [1, 1, 2], [1, 3], [4], [4]]])

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
        # for match in all_matches:
        #     print(match)
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

    # def test_fit_first(self):
    #     lobby ={
    #         "groups":[
    #                 {
    #                     "_id": "609cc564b0105c43e02ba04f",
    #                     "num_players": 2,
    #                     "players": {
    #                         "6024098ac9b27e9f9995df97": "template",
    #                         "607228229a8f71adf99cbfbe": "max"
    #                     }
    #                 },
    #                 {
    #                     "_id": "60a1861c2d951ae021f05d60",
    #                     "num_players": 2,
    #                     "players": {
    #                         "60a5f2fa05f1815bd50e4522": "braden",
    #                         "60a5fec405f1815bd50e452b": "sadfasfas"
    #                     }
    #                 }
    #             ]
    #     }
    #     templates = [[[2], [2]]]
    #     teams = fit_first(templates, lobby)
    #     self.assertequal(teams,
    #                      [[
    #                 {
    #                     "_id": "609cc564b0105c43e02ba04f",
    #                     "num_players": 2,
    #                     "players": {
    #                         "6024098ac9b27e9f9995df97": "template",
    #                         "607228229a8f71adf99cbfbe": "max"
    #                     }
    #                 }],
    #                 [{
    #                     "_id": "60a1861c2d951ae021f05d60",
    #                     "num_players": 2,
    #                     "players": {
    #                         "60a5f2fa05f1815bd50e4522": "braden",
    #                         "60a5fec405f1815bd50e452b": "sadfasfas"
    #                     }
    #                 }]
    #                      ]
    #                      )
    #
    # def test_fit_first_2(self):
    #     lobby = {
    #         "groups": [
    #             {
    #                 "_id": "609716516baf12b180e1a95c",
    #                 "num_players": 1,
    #                 "players": {
    #                     "6024098ac9b27e9f9995df97": "alexd1214",
    #                 }
    #             },
    #             {
    #                 "_id": "609cc564b0105c43e02ba04f",
    #                 "num_players": 2,
    #                 "players": {
    #                     "6024098ac9b27e9f9995df97": "template",
    #                     "607228229a8f71adf99cbfbe": "max"
    #                 }
    #             },
    #             {
    #                 "_id": "60a1861c2d951ae021f05d60",
    #                 "num_players": 2,
    #                 "players": {
    #                     "60a5f2fa05f1815bd50e4522": "braden",
    #                     "60a5fec405f1815bd50e452b": "sadfasfas"
    #                 }
    #             },
    #             {
    #                 "_id": "609719c646fabbf5e1931578",
    #                 "num_players": 1,
    #                 "players": {
    #                     "6024098ac9b27e9f9995df97": "mikescott0808",
    #                 }
    #             }
    #         ]
    #     }
    #     templates = [[[1, 2], [1, 2]]]
    #     teams = fit_first(templates, lobby)
    #     self.assertequal(teams,
    #      [[
    #          {
    #              "_id": "609716516baf12b180e1a95c",
    #              "num_players": 1,
    #              "players": {
    #                  "6024098ac9b27e9f9995df97": "alexd1214",
    #              }
    #          },
    #          {
    #              "_id": "609cc564b0105c43e02ba04f",
    #              "num_players": 2,
    #              "players": {
    #                  "6024098ac9b27e9f9995df97": "template",
    #                  "607228229a8f71adf99cbfbe": "max"
    #              }
    #          }
    #      ],
    #      [
    #          {
    #              "_id": "609719c646fabbf5e1931578",
    #              "num_players": 1,
    #              "players": {
    #                  "6024098ac9b27e9f9995df97": "mikescott0808",
    #              }
    #          },
    #          {
    #              "_id": "60a1861c2d951ae021f05d60",
    #              "num_players": 2,
    #              "players": {
    #                  "60a5f2fa05f1815bd50e4522": "braden",
    #                  "60a5fec405f1815bd50e452b": "sadfasfas"
    #              }
    #          }
    #      ]
    #      ])
    #
    # def test_fit_first_3(self):
    #     lobby = {
    #         "groups": [
    #             {
    #                 "_id": "609716516baf12b180e1a95c",
    #                 "num_players": 1,
    #                 "players": {
    #                     "6024098ac9b27e9f9995df97": "alexd1214",
    #                 }
    #             },
    #             {
    #                 "_id": "609cc564b0105c43e02ba04f",
    #                 "num_players": 2,
    #                 "players": {
    #                     "6024098ac9b27e9f9995df97": "template",
    #                     "607228229a8f71adf99cbfbe": "max"
    #                 }
    #             },
    #             {
    #                 "_id": "60a1861c2d951ae021f05d60",
    #                 "num_players": 2,
    #                 "players": {
    #                     "60a5f2fa05f1815bd50e4522": "braden",
    #                     "60a5fec405f1815bd50e452b": "sadfasfas"
    #                 }
    #             },
    #             {
    #                 "_id": "609719c646fabbf5e1931578",
    #                 "num_players": 1,
    #                 "players": {
    #                     "6024098ac9b27e9f9995df97": "mikescott0808",
    #                 }
    #             }
    #         ]
    #     }
    #     templates = [[[1,1], [2], [2]]]
    #     teams = fit_first(templates, lobby)
    #     self.assertequal(teams,
    #      [[
    #          {
    #              "_id": "609716516baf12b180e1a95c",
    #              "num_players": 1,
    #              "players": {
    #                  "6024098ac9b27e9f9995df97": "alexd1214",
    #              }
    #          },
    #          {
    #              "_id": "609719c646fabbf5e1931578",
    #              "num_players": 1,
    #              "players": {
    #                  "6024098ac9b27e9f9995df97": "mikescott0808",
    #              }
    #          }
    #      ],
    #          [
    #              {
    #                  "_id": "609cc564b0105c43e02ba04f",
    #                  "num_players": 2,
    #                  "players": {
    #                      "6024098ac9b27e9f9995df97": "template",
    #                      "607228229a8f71adf99cbfbe": "max"
    #                  }
    #              }
    #          ],
    #      [
    #          {
    #              "_id": "60a1861c2d951ae021f05d60",
    #              "num_players": 2,
    #              "players": {
    #                  "60a5f2fa05f1815bd50e4522": "braden",
    #                  "60a5fec405f1815bd50e452b": "sadfasfas"
    #              }
    #          }
    #      ],
    #
    #      ])


if __name__ == "__main__":
    unittest.main()
