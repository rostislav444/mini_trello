from flask import Blueprint
from flask import request
from app.models import UsersModel

main_routes = Blueprint('main_routes', __name__)


@main_routes.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return {'error': 'Email and password are required'}, 400

    users = list(UsersModel.user_email_index.query(email))

    if not users:
        return {'error': 'User not found'}, 404

    user = users[0]

    if not user.verify_password(password):
        return {'error': 'Invalid password'}, 400

    return {
        'token': user.generate_token(),
        'user': user.to_dict()
    }, 200

