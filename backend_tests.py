import unittest
from backend import *

class MyTestCase(unittest.TestCase):

    def test_reset(self):
        reset_patch()
        assert get_lobbies_get() == { "lobbies_list": [] }
        assert get_groups_get() == { "groups_list": [] }
        assert get_discords_get() == {
            "discords_list": [
                {
                    "_id": "6081b22d21529f0c00073c5b",
                    "room_name": "Room 1",
                    "status": "open"
                },
                {
                    "_id": "6081b23a21529f0c00073c5c",
                    "room_name": "Room 2",
                    "status": "open"
                },
                {
                    "_id": "6081b23f21529f0c00073c5d",
                    "room_name": "Room 3",
                    "status": "open"
                },
                {
                    "_id": "6081b24521529f0c00073c5e",
                    "room_name": "Room 4",
                    "status": "open"
                },
                {
                    "_id": "6081b24a21529f0c00073c5f",
                    "room_name": "Room 5",
                    "status": "open"
                }
            ]
        }


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

    def get_users_post_test(self):
        userToAdd = {
            "name": "Backend_testAcc",
            "email": "Backend_testAcc@gmail.com",
            "password": "asdf",
            "friends": {},
            "games_table": {
              'Krunker - Hardpoint': {
                "game_score": 1000,
                "time_played": 0
              }
            },
            "group": None,
            "in_queue": False,
            "has_voted": False,
            "lobby": None,
            "profile_info": {
              "bio": 'This user has no bio',
              "discord": '',
              "profile_pic": '../../images/DefaultProfilePic.jpg',
              "steam_friend_code": '',
              "steam_name": ''
            }
        }
        assert get_users_post(userToAdd) == userToAdd



if __name__ == '__main__':
    unittest.main()

