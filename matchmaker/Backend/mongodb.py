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

    def patch(self):
        old_entry = self.collection.find_one({"_id": ObjectId(self._id)})
        for field in old_entry.keys():
            if field not in self:
                self.update({field: old_entry[field]})
        self.collection.update(
            {"_id": ObjectId(self._id)}, self)
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
    # db_client = pymongo.MongoClient(host=['mongodb+srv://match-maker-db.62sjf.mongodb.net/Match-Maker-DB'])

    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")
    # db = client.test

    collection = db_client["users"]["users_list"]

    def find_all(self):
        users = list(self.collection.find())
        for user in users:
            user["_id"] = str(user["_id"])  # converting ObjectId to str
        return users

    def find_by_name(self, name):
        users = list(self.collection.find({"name": name}))
        for user in users:
            user["_id"] = str(user["_id"])
        return users


class Game(Model):
    # db_client = pymongo.MongoClient(host=['mongodb+srv://match-maker-db.62sjf.mongodb.net/Match-Maker-DB'])

    db_client = pymongo.MongoClient(
        "mongodb+srv://Chris:MakeAMatch@match-maker-db.62sjf.mongodb.net/Match-Maker-DB?retryWrites=true&w=majority")
    # db = client.test

    collection = db_client["games"]["games_list"]

    def find_all(self):
        games = list(self.collection.find())
        for game in games:
            game["_id"] = str(game["_id"])  # converting ObjectId to str
        return games

    def find_by_name(self, game_name):
        games = list(self.collection.find({"game_name": game_name}))
        for game in games:
            game["_id"] = str(game["_id"])
        return games
