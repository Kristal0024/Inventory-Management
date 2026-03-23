import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client=MongoClient(os.getenv("MONGO_URI"))


try:
    client.server_info()
    print("db connected successfully")
except Exception as e:
    print("connection failed", e)

db=client["inventory"]

if client:
    print("db connected successfully")
else:
    print("connection failed")


user_collection=db["users"]
product_collection=db["products"]
order_collection=db["orders"]