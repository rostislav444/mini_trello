from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

from app.models import UsersModel
from app.routes import main_routes
from app.schema import schema
from utils.startup import create_tables, create_admin_user

app = Flask(__name__)

create_tables()
create_admin_user()

CORS(app)

app.debug = True
app.config['JWT_SECRET_KEY'] = 'secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
jwt = JWTManager(app)


@app.route('/check_token', methods=['POST'])
@jwt_required()
def check_token():
    user_id = get_jwt_identity()
    try:
        UsersModel.get(user_id)
    except UsersModel.DoesNotExist:
        return "User does not exist", 401
    return "OK", 200


@app.route('/graphql', methods=['POST'])
@jwt_required()
def graphql_server():
    user_id = get_jwt_identity()
    try:
        UsersModel.get(user_id)
    except UsersModel.DoesNotExist:
        return "User does not exist", 401

    context = {"user": user_id}
    return GraphQLView.as_view('graphql', schema=schema, context=context, root_value=context, graphiql=True)()


app.register_blueprint(main_routes)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
