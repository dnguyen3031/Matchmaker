import unittest
from suitable_lobby import get_group_sizes
from suitable_lobby import get_team_combos
from suitable_lobby import init_group_matrix
from suitable_lobby import check_groups_splittable



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

        self.assertEqual(groups, [1, 2, 3, 5])

    def test_init_group_matrix(self):
        matrix = init_group_matrix([1,2,3,4], 5)
        self.assertEqual(matrix,
             [[None, None, None, None, None, None],
              [[[]], None, None, None, None, None],
              [[[]], None, None, None, None, None],
              [[[]], None, None, None, None, None],
              [[[]], None, None, None, None, None]])

    def test_team_combos(self):
        tc = get_team_combos( [1,2,3,4], 5)
        self.assertEqual(tc, [[2,3], [1,4]])

    def test_team_combos_repeating(self):
        tc = get_team_combos( [1, 1, 2, 2, 2], 4)
        self.assertEqual(tc, [[1,1,2], [2,2]])

    def test_team_combos_fail(self):
        tc = get_team_combos( [2,4,4], 5)
        self.assertEqual(tc, None)

    def test_team_combos_solos(self):
        tc = get_team_combos( [1, 1, 1, 1] , 2)
        self.assertEqual(tc, [[1,1]])

    def test_splittable(self):
        sp = check_groups_splittable([1, 1, 1, 1], 2, 2)
        self.assertEqual(sp, True)

    def test_splittable_3(self):
        sp = check_groups_splittable([1,1,2,2,3,3], 3, 4)
        self.assertEqual(sp, True)

    def test_splittable_4(self):
        sp = check_groups_splittable([2, 2, 2, 2, 2], 5, 3)
        self.assertEqual(sp, True)

    def test_splittable_sm(self):
        sp = check_groups_splittable([1], 2, 4)
        self.assertEqual(sp, True)

    def test_splittable_f(self):
        sp = check_groups_splittable([3, 2, 3], 2, 4)
        self.assertEqual(sp, False)

    def test_splittable_f2(self):
        sp = check_groups_splittable([1, 3, 3, 3], 2, 5)
        self.assertEqual(sp, False)

    def test_splittable_unfilled_f(self):
        sp = check_groups_splittable([3, 3, 3], 2, 5)
        self.assertEqual(sp, False)

    def test_splittable_unfilled_f2(self):
        sp = check_groups_splittable([2,2,2,2,2,3], 5, 3)
        self.assertEqual(sp, False)


if __name__ == '__main__':
    unittest.main()
