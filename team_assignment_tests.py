import unittest
from team_assignment import *


class MyTestCase(unittest.TestCase):

    # def test_find_best_teams(self):
    #     groups = [
    #                 {
    #                     "_id": "609cc564b0105c43e02ba04f",
    #                     "num_players": 2,
    #                     "players": {
    #                         "6024098ac9b27e9f9995df97": "Template",
    #                         "607228229a8f71adf99cbfbe": "max"
    #                     }
    #                 },
    #                 {
    #                     "_id": "60a1861c2d951ae021f05d60",
    #                     "num_players": 2,
    #                     "players": {
    #                         "607228229a8f71adf99cbfbe": "max",
    #                         "6024098ac9b27e9f9995df97": "Template"
    #                     }
    #                 }
    #             ]
    #     t = find_best_teams(groups, 2 , 1)
    #
    #     self.assertEqual(t, [])

    def test_GMT_1(self):
        groups = [1,1,1,1,2,2]
        t = get_match_templates(groups, 4, 2)
        self.assertEqual(t, [[[1,1,1,1], [2,2]],
                             [[1,1,2], [1,1,2]],
                             [[2,2], [1,1,1,1]]])

    def test_fit_first(self):
        lobby ={
            "groups":[
                    {
                        "_id": "609cc564b0105c43e02ba04f",
                        "num_players": 2,
                        "players": {
                            "6024098ac9b27e9f9995df97": "Template",
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
                    }
                ]
        }
        templates = [[[2], [2]]]
        teams = fit_first(templates, lobby)
        self.assertEqual(teams,
                         [[
                    {
                        "_id": "609cc564b0105c43e02ba04f",
                        "num_players": 2,
                        "players": {
                            "6024098ac9b27e9f9995df97": "Template",
                            "607228229a8f71adf99cbfbe": "max"
                        }
                    }],
                    [{
                        "_id": "60a1861c2d951ae021f05d60",
                        "num_players": 2,
                        "players": {
                            "60a5f2fa05f1815bd50e4522": "braden",
                            "60a5fec405f1815bd50e452b": "sadfasfas"
                        }
                    }]
                         ]
                         )

    def test_fit_first_2(self):
        lobby = {
            "groups": [
                {
                    "_id": "609716516baf12b180e1a95c",
                    "num_players": 1,
                    "players": {
                        "6024098ac9b27e9f9995df97": "AlexD1214",
                    }
                },
                {
                    "_id": "609cc564b0105c43e02ba04f",
                    "num_players": 2,
                    "players": {
                        "6024098ac9b27e9f9995df97": "Template",
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
                    "_id": "609719c646fabbf5e1931578",
                    "num_players": 1,
                    "players": {
                        "6024098ac9b27e9f9995df97": "MikeScott0808",
                    }
                }
            ]
        }
        templates = [[[1, 2], [1, 2]]]
        teams = fit_first(templates, lobby)
        self.assertEqual(teams,
         [[
             {
                 "_id": "609716516baf12b180e1a95c",
                 "num_players": 1,
                 "players": {
                     "6024098ac9b27e9f9995df97": "AlexD1214",
                 }
             },
             {
                 "_id": "609cc564b0105c43e02ba04f",
                 "num_players": 2,
                 "players": {
                     "6024098ac9b27e9f9995df97": "Template",
                     "607228229a8f71adf99cbfbe": "max"
                 }
             }
         ],
         [
             {
                 "_id": "609719c646fabbf5e1931578",
                 "num_players": 1,
                 "players": {
                     "6024098ac9b27e9f9995df97": "MikeScott0808",
                 }
             },
             {
                 "_id": "60a1861c2d951ae021f05d60",
                 "num_players": 2,
                 "players": {
                     "60a5f2fa05f1815bd50e4522": "braden",
                     "60a5fec405f1815bd50e452b": "sadfasfas"
                 }
             }
         ]
         ])

    def test_fit_first_3(self):
        lobby = {
            "groups": [
                {
                    "_id": "609716516baf12b180e1a95c",
                    "num_players": 1,
                    "players": {
                        "6024098ac9b27e9f9995df97": "AlexD1214",
                    }
                },
                {
                    "_id": "609cc564b0105c43e02ba04f",
                    "num_players": 2,
                    "players": {
                        "6024098ac9b27e9f9995df97": "Template",
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
                    "_id": "609719c646fabbf5e1931578",
                    "num_players": 1,
                    "players": {
                        "6024098ac9b27e9f9995df97": "MikeScott0808",
                    }
                }
            ]
        }
        templates = [[[1,1], [2], [2]]]
        teams = fit_first(templates, lobby)
        self.assertEqual(teams,
         [[
             {
                 "_id": "609716516baf12b180e1a95c",
                 "num_players": 1,
                 "players": {
                     "6024098ac9b27e9f9995df97": "AlexD1214",
                 }
             },
             {
                 "_id": "609719c646fabbf5e1931578",
                 "num_players": 1,
                 "players": {
                     "6024098ac9b27e9f9995df97": "MikeScott0808",
                 }
             }
         ],
             [
                 {
                     "_id": "609cc564b0105c43e02ba04f",
                     "num_players": 2,
                     "players": {
                         "6024098ac9b27e9f9995df97": "Template",
                         "607228229a8f71adf99cbfbe": "max"
                     }
                 }
             ],
         [
             {
                 "_id": "60a1861c2d951ae021f05d60",
                 "num_players": 2,
                 "players": {
                     "60a5f2fa05f1815bd50e4522": "braden",
                     "60a5fec405f1815bd50e452b": "sadfasfas"
                 }
             }
         ],

         ])


if __name__ == '__main__':
    unittest.main()
