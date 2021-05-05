import unittest
from timer_module import get_group_sizes
from timer_module import check_groups_splittable



class MyTestCase(unittest.TestCase):
    def test_get_group_sizes(self):
        groups= get_group_sizes(
            [{
            "_id": "60907183df22034b908bcf23",
            "num_players": 2,
            "players": {
                "6024098ac9b27e9f9995df97": "Template",
                "607228229a8f71adf99cbfbe": "max"}
            }]
            ,
            [{
                "_id": "6090e994d26e32720df1f31e",
                "num_players": 1,
                "players": {
                    "6090e975d26e32720df1f31d": "X"
                }
            },
            {
                "_id": "6090e994d26e32720df1f31e",
                "num_players": 5,
                "players": {
                    "6090e975d26e32720df1f31d": "X"
                }
            },
            {
                "_id": "6090e994d26e32720df1f31e",
                "num_players": 3,
                "players": {
                    "6090e975d26e32720df1f31d": "X"
                }
            }
            ]
        )
        self.assertEqual(str(groups), "[5, 3, 2, 1]")


if __name__ == '__main__':
    unittest.main()
