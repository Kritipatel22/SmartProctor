from flask import Blueprint, request, jsonify
from utils import token_required, serialize_docs

activity_bp = Blueprint("activity", __name__)


@activity_bp.route("/", methods=["GET"])
@token_required
def get_logs():
    """GET /api/activity — list proctoring logs."""
    from app import db
    logs = list(db.activity_logs.find().sort("_id", -1))
    return jsonify(serialize_docs(logs))


@activity_bp.route("/", methods=["POST"])
@token_required
def create_log():
    """POST /api/activity — log a proctoring event."""
    from app import db
    data = request.get_json()
    result = db.activity_logs.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201
