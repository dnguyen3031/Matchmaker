import unittest
from backend import *

class MyTestCase(unittest.TestCase):

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

    def test_reset(self):
        reset_patch()
        # reset_users may be hard to test
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
        assert get_games_get(None) == {
        "games_list": [
            {
                "_id": "60240d8261cfcfb0e9a958cb",
                "avg_length": 900,
                "categories": [
                    "FPS",
                    "Free",
                    "Browser Game"
                ],
                "game_name": "Krunker - Hardpoint",
                "num_players": 4,
                "num_teams": 2,
                "queue": [],
                "ranking_levels": [
                    300,
                    700,
                    1100,
                    1500,
                    1900,
                    2300,
                    2700
                ]
            },
            {
                "_id": "606a301564025379af1e70ce",
                "avg_length": 900,
                "categories": [
                    "IO Game",
                    "Free",
                    "Browser Game"
                ],
                "game_name": "Skribbl.io",
                "num_players": 6,
                "num_teams": 3,
                "queue": [],
                "ranking_levels": [
                    300,
                    700,
                    1100,
                    1500,
                    1900,
                    2300,
                    2700
                ]
            }
        ]
    }


    def test_get_users_get(self):
        reset_patch()
        actual_users_list_1 = get_users_get("Template", None, None)
        actual_users_list_2 = get_users_get(None, "Template", None)
        actual_users_list_3 = get_users_get(None, None, "template@gmail.com")

        # expected_users_list_1 = {
        # "users_list": [
        #     {
        #         "_id": "60b9bdbc43967866c21dc9fe",
        #         "email": "template@gmail.com",
        #         "friends": {
        #             "60b9bdbc43967866c21dc9fe": {
        #                 "name": "Template",
        #                 "status": "Deleted"
        #             },
        #             "607228229a8f71adf99cbfbe": {
        #                 "name": "max",
        #                 "status": "Standard"
        #             },
        #             "profileID": {
        #                 "name": "not an Id",
        #                 "status": "Deleted"
        #             }
        #         },
        #         "games_table": {
        #             "Krunker - Hardpoint": {
        #                 "game_score": 475,
        #                 "time_played": 420
        #             },
        #             "Skribbl.io": {
        #                 "game_score": 532,
        #                 "time_played": 420
        #             }
        #         },
        #         "group": None,
        #         "has_voted": False,
        #         "in_queue": False,
        #         "lobby": None,
        #         "name": "Template",
        #         "password": "$2a$09$cMC6BmamTxj8fNAg/7d3muMDulYOaKNa0Q2C.ykVYrULzUtwn9OkW",
        #         "profile_info": {
        #             "bio": "I like playing Krunker, especially the Hardpoint game mode!",
        #             "discord": "template#1234",
        #             "profile_pic": "4",
        #             "steam_friend_code": "123456789",
        #             "steam_name": "Template"
        #             }
        #         }
        #     ]
        # }

        expected_users_list_1 = {
            "users_list": [
                {
                    "_id": "60b9bdbc43967866c21dc9fe",
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
                        "60b9bdbc43967866c21dc9fe": {
                            "name": "Template",
                            "status": "Deleted"
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
                    "password": "$2a$09$Pob7fIUF0lBx92Lv5wxroug6316ebDdIJlscxE3OP4.2FjMuRHSU.",
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
                "_id": "60b9bdbc43967866c21dc9fe",
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
        reset_patch()
        assert actual_users_list_1 == expected_users_list_1
        assert actual_users_list_2 == expected_users_list_2
        assert actual_users_list_3 == expected_users_list_1

    def test_get_groups_get(self):
        reset_patch()
        expected_groups_list = {
            "groups_list": []
        }
        assert get_groups_get() == expected_groups_list

    # def test_get_group_get(self):
    #     with app.app_context():
    #         assert get_group_get(None) != None
    #         assert get_group_get("60240d8261cfcfb0e9a958cb") != None
    #
    # def test_get_group_delete(self):
    #     with app.app_context():
    #         assert get_group_delete("60240d8261cfcfb0e9a958cb") != None

    def test_get_lobbies_get(self):
        expected_lobbies_list = {
            "lobbies_list": []
        }
        assert get_lobbies_get() == expected_lobbies_list

    def test_get_discords_get(self):
        expected_discords_list = {
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
        assert get_discords_get() == expected_discords_list

    def test_get_next_discord_get(self):
        expected = {
            "room_name": "Room 1"
        }

        assert get_next_discord_get() != None


    def test_add_to_queue_patch(self):
        reset_patch()
        with app.app_context():
            assert add_to_queue_patch( "Krunker - Hardpoint", "60b9bdbc43967866c21dc9fe") != None
            assert add_to_queue_patch("Krunker - Hardpoint", "6024098ac9b27e9f9995df90") != None

    def test_add_new_game_patch(self):
        with app.app_context():
            assert add_new_game_patch("Krunker - Hardpoint", "60b9bdbc43967866c21dc9fe") != None
            assert add_new_game_patch("Krunker - Hardpoint", "6024098ac9b27e9f9995df90") != None

    def test_get_user_get(self):
        with app.app_context():
            assert get_user_get("60b9bdbc43967866c21dc9fe", None) != None
            assert get_user_get("6024098ac9b27e9f9995df96", None) != None

    def test_get_user_delete(self):
        with app.app_context():
            assert get_user_delete("6024098ac9b27e9f9995df96") != None

    def test_get_group_get(self):
        with app.app_context():
            assert get_group_get(None) != None
            assert get_group_get("60240d8261cfcfb0e9a958cb") != None

    def test_get_group_delete(self):
        with app.app_context():
            assert get_group_delete("60240d8261cfcfb0e9a958aa") != None

    def test_get_lobby_get(self):
        with app.app_context():
            assert get_lobby_get("60240d8261cfcfb0e9a958cc") != None

    def test_get_lobby_delete(self):
        with app.app_context():
            assert get_lobby_delete("60240d8261cfcfb0e9a958cc") != None


    def test_get_game_get(self):
        with app.app_context():
            assert get_game_get(None) != None
            assert get_game_get("60240d8261cfcfb0e9a958cb") != None

    def test_get_game_delete(self):
        with app.app_context():
            assert get_game_delete("60240d8261cfcfb0e9a958ca") != None

    def test_get_discord_get(self):
        with app.app_context():
            assert get_discord_get(None) != None
            assert get_discord_get("60240d8261cfcfb0e9a958cb") != None

    def test_get_discord_delete(self):
        with app.app_context():
            assert get_discord_get(None) != None
            assert get_discord_get("60240d8261cfcfb0e9a958ca") != None


    def test_get_discord_patch(self):
        change = {
            "status" : "open"
        }
        with app.app_context():
            assert get_discord_patch("6081b22d21529f0c00073c5b", change) != None

    def test_get_users_post_test(self):
        with app.app_context():
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
            assert get_users_post(userToAdd) != None

    # def test_get_user_get_patch_delete_test(self):
    #     actual_users_list_1 = get_users_get("Backend_testAcc", None, None)
    #
    #     #test get
    #     print(actual_users_list_1["users_list"])
    #     # print((actual_users_list_1["users_list"])[0])
    #     assert get_user_get(actual_users_list_1["users_list"], None) == actual_users_list_1
    #
    #     #test patch
    #     bioUpdate = { "profile_info": {
    #             "bio": 'This user has a bio',
    #             "discord": '',
    #             "profile_pic": '../../images/DefaultProfilePic.jpg',
    #             "steam_friend_code": '',
    #             "steam_name": ''
    #             }
    #         }
    #     get_user_patch(actual_users_list_1["_id"], bioUpdate)
    #     patchedAcc = {
    #         "name": "Backend_testAcc",
    #         "email": "Backend_testAcc@gmail.com",
    #         "password": "asdf",
    #         "friends": {},
    #         "games_table": {
    #             'Krunker - Hardpoint': {
    #                 "game_score": 1000,
    #                 "time_played": 0
    #             }
    #         },
    #         "group": None,
    #         "in_queue": False,
    #         "has_voted": False,
    #         "lobby": None,
    #         "profile_info": {
    #             "bio": 'This user has a bio',
    #             "discord": '',
    #             "profile_pic": '../../images/DefaultProfilePic.jpg',
    #             "steam_friend_code": '',
    #             "steam_name": ''
    #             }
    #     }
    #     assert get_users_get("Backend_testAcc", None, None) == patchedAcc
    #
    #     #test delete
    #     assert get_user_delete(actual_users_list_1["_id"]) == None

if __name__ == '__main__':
    unittest.main()

