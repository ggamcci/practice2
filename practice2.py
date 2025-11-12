from flask import Flask, request, jsonify
import datetime

app = Flask(__name__)

@app.before_request
def log_request_info():
    print(f"[{datetime.datetime.now()}] {request.method} {request.path}")

def make_response(status, data=None, code=200):
    return jsonify({"status": status, "data": data}), code


@app.route('/api/hello', methods=['GET'])
def get_hello():
    return make_response("success", {"message": "Hello, Flask!"}, 200)

@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    if item_id == 1:
        return make_response("success", {"item": {"id": 1, "name": "Apple"}}, 200)
    else:
        return make_response("error", {"message": "Item not found"}, 404)


@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.get_json()
    if not data or "name" not in data:
        return make_response("error", {"message": "Missing item name"}, 400)
    return make_response("success", {"message": "Item created", "item": data}, 201)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if "username" not in data:
        return make_response("error", {"message": "Username required"}, 400)
    return make_response("success", {"user": data}, 201)


@app.route('/api/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.get_json()
    if not data:
        return make_response("error", {"message": "No data provided"}, 400)
    return make_response("success", {"message": f"Item {item_id} updated", "data": data}, 200)

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    if user_id <= 0:
        return make_response("error", {"message": "Invalid user ID"}, 400)
    return make_response("success", {"message": f"User {user_id} updated"}, 200)


@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    if item_id == 999:
        return make_response("error", {"message": "Server failed to delete"}, 500)
    return make_response("success", {"message": f"Item {item_id} deleted"}, 200)

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if user_id == 1:
        return make_response("success", {"message": "User deleted"}, 204)
    else:
        return make_response("error", {"message": "User not found"}, 404)


if __name__ == '__main__':
    app.run(debug=True)
