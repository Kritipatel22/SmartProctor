import jwt
from werkzeug.security import check_password_hash
import datetime
from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from utils import token_required, serialize_doc

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """POST /api/auth/login — validate credentials, return JWT + user data."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    from app import db
    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid email or password"}), 400

    if not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid email or password"}), 400

    token = jwt.encode(
        {"id": str(user["_id"]), "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "avatar": user.get("avatar", "")
        }
    })


@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    """GET /api/auth/me — get current user from token."""
    user = request.current_user
    return jsonify({
        "id": user["_id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "avatar": user.get("avatar", "")
    })
