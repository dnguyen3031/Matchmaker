import unittest
from team_assignment import *


class MyTestCase(unittest.TestCase):

    def test_find_best_teams(self):
        groups = [
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
                            "607228229a8f71adf99cbfbe": "max",
                            "6024098ac9b27e9f9995df97": "Template"
                        }
                    }
                ]
        t = find_all_possible_matchups(groups)

        self.assertEqual(t, [])


if __name__ == '__main__':
    unittest.main()
