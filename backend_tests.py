import unittest
from backend import *

class MyTestCase(unittest.TestCase):

    def test_get_users_get(self):
        actual_users_list_1 = get_users_get("Template", None, None)
        actual_users_list_2 = get_users_get(None, "Template", None)
        actual_users_list_3 = get_users_get(None, None, "template@gmail.com")

        expected_users_list_1 = {
        "users_list": [
            {
                "_id": "6024098ac9b27e9f9995df97",
                "email": "template@gmail.com",
                "friends": {
                    "6024098ac9b27e9f9995df97": {
                        "name": "Template",
                        "status": "Deleted"
                    },
                    "607228229a8f71adf99cbfbe": {
                        "name": "max",
                        "status": "Standard"
                    },
                    "profileID": {
                        "name": "not an Id",
                        "status": "Deleted"
                    }
                },
                "games_table": {
                    "Krunker - Hardpoint": {
                        "game_score": 475,
                        "time_played": 420
                    },
                    "Skribbl.io": {
                        "game_score": 532,
                        "time_played": 420
                    }
                },
                "group": None,
                "has_voted": False,
                "in_queue": False,
                "lobby": None,
                "name": "Template",
                "password": "$2a$09$cMC6BmamTxj8fNAg/7d3muMDulYOaKNa0Q2C.ykVYrULzUtwn9OkW",
                "profile_info": {
                    "bio": "I like playing Krunker, especially the Hardpoint game mode!",
                    "discord": "template#1234",
                    "profile_pic": "4",
                    "steam_friend_code": "123456789",
                    "steam_name": "Template"
                    }
                }
            ]
        }

        expected_users_list_2 = {
        "users_list": [
            {
                "_id": "6024098ac9b27e9f9995df97",
                "name": "Template",
                "profile_info": {
                    "bio": "I like playing Krunker, especially the Hardpoint game mode!",
                    "discord": "template#1234",
                    "profile_pic": "4",
                    "steam_friend_code": "123456789",
                    "steam_name": "Template"
                    }
                }
            ]
        }
        assert actual_users_list_1 == expected_users_list_1
        assert actual_users_list_2 == expected_users_list_2
        assert actual_users_list_3 == expected_users_list_1


if __name__ == '__main__':
    unittest.main()

