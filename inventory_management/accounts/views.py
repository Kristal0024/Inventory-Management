import json
import bcrypt
import jwt
import datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from core.mongo import user_collection


@csrf_exempt
def sign_up(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        email = data.get("email").lower()
        password = data.get("password")

        if not username or not email or not password:
            return JsonResponse({"error": "All fields required"}, status=400)

        email = email.lower()

        if user_collection.find_one({"email": email}):
            return JsonResponse({"error": "Email already exists"}, status=400)

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

        user_collection.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password
        })

        return JsonResponse({"message": "User created successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        user = user_collection.find_one({"email": email})

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        if not bcrypt.checkpw(password.encode(), user["password"]):
            return JsonResponse({"error": "Invalid password"}, status=401)

        payload = {
            "user_id": str(user["_id"]),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        

        return JsonResponse({
            "message": "Login successful",
            "token": token
        })

    return JsonResponse({"error": "Invalid request method"}, status=405)