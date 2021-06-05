import pymongo
from bson import ObjectId


class Model(dict):
    """
    A simple model that wraps mongodb document
    """
    __getattr__ = dict.get
    __delattr__ = dict.__delitem__
    __setattr__ = dict.__setitem__

    def save(self):
        if not self._id:
            self.collection.insert(self)
        else:
            self.collection.update(
                {"_id": ObjectId(self._id)}, self)
        self._id = str(self._id)

    def merge_dict(self, cur, old):
        for field in old.keys():
            if field not in cur:
                cur.update({field: old[field]})
            elif isinstance(old[field], dict) and (field in cur):
                self.merge_dict(cur[field], old[field])

    def patch(self):
        if not self._id:
            self.collection.insert(self)
        else:
            old_entry = self.collection.find_one({"_id": ObjectId(self._id)})
            self.merge_dict(self, old_entry)
            self.collection.update(
                {"_id": ObjectId(self._id)}, self)
        self._id = str(self._id)

    def replace_dict(self, cur, old):
        new = {"_id": ObjectId(self._id)}
        for field in old.keys():
            if field not in cur:
                new.update({field: old[field]})
        return new

    def delete_field(self):
        if not self._id:
            self.collection.insert(self)
        else:
            old_entry = self.collection.find_one({"_id": ObjectId(self._id)})
            new_entry = self.replace_dict(self, old_entry)
            self.collection.update(
                {"_id": ObjectId(self._id)}, new_entry)
        self._id = str(self._id)

    def reload(self):
        if self._id:
            result = self.collection.find_one({"_id": ObjectId(self._id)})
            if result:
                self.update(result)
                self._id = str(self._id)
                return True
        return False

    def remove(self):
        if self._id:
            resp = self.collection.delete_one({"_id": ObjectId(self._id)})
            return resp.deleted_count


class User(Model):
    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")

    collection = db_client["users"]["users_list"]

    def find_all(self):
        users = list(self.collection.find())
        for user in users:
            user["_id"] = str(user["_id"])
        return users

    def find_by_name(self, name):
        users = list(self.collection.find({"name": name}))
        for user in users:
            user["_id"] = str(user["_id"])
        return users

    def secure_find_by_name(self, name):
        # does not return password ect. for security reasons. Used for search page
        cleaned_users = []
        users = self.find_all()
        users_copy = users.copy()
        for user in users_copy:
            if user["name"].lower() != name.lower(): # search is case insensitive
                users.remove(user)
        for user in users:
            user_copy = {"_id": str(user["_id"]), "name": user["name"], "profile_info": user["profile_info"]}
            cleaned_users.append(user_copy)
        return cleaned_users

    def find_by_email(self, email):
        users = list(self.collection.find({"email": email}))
        for user in users:
            user["_id"] = str(user["_id"])
        return users


class Group(Model):
    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")

    collection = db_client["groups"]["groups_list"]

    def find_all(self):
        groups = list(self.collection.find())
        for group in groups:
            group["_id"] = str(group["_id"])
        return groups


class Game(Model):
    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")

    collection = db_client["games"]["games_list"]

    def find_all(self):
        games = list(self.collection.find())
        for game in games:
            game["_id"] = str(game["_id"])
        return games

    def find_by_name(self, game_name):
        games = list(self.collection.find({"game_name": game_name}))
        for game in games:
            game["_id"] = str(game["_id"])
        return games

    def append_to_queue(self, game_name, new_lobby):
        self.collection.update(
            {"game_name": game_name},
            {'$push': {'queue': new_lobby}}
        )
        # print(self)
        # for lobby in self.queue:
        #     print(lobby)
        #     for group in lobby["groups"]:
        #         print(group)
        #         for player in group["players"]:
        #             print(player)
        #             if player in new_lobby["groups"][0]["players"]:
        #                 print("found")
        return new_lobby
        # return "lobby not added to queue"

    def update_window_size(self, game_name, queue):
        self.collection.update(
            {"game_name": game_name},
            {'$set': {'queue': queue}}
        )


class Lobby(Model):
    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")

    collection = db_client["lobbies"]["lobbies_list"]

    def find_all(self):
        lobbies = list(self.collection.find())
        for lobby in lobbies:
            lobby["_id"] = str(lobby["_id"])
        return lobbies


class Discord(Model):
    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")

    collection = db_client["discords"]["discords_list"]

    def find_all(self):
        discords = list(self.collection.find())
        for discord in discords:
            discord["_id"] = str(discord["_id"])
        return discords

    def find_by_name(self, room_name):
        discords = list(self.collection.find({"room_name": room_name}))
        for discord in discords:
            discord["_id"] = str(discord["_id"])
        return discords
