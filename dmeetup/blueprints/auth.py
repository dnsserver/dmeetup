import bcrypt

from flask import Blueprint, request, jsonify

from ..database import db, User, BlacklistToken

bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        respObj = {
                'status':'fail',
                'message':'Please provide a username/password and full name.'
                }
        return jsonify(respObj), 401

    user = User.query.filter_by(email=data.get('email')).first()
    if not user:
        try:
            pwd = bcrypt.hashpw(data.get('password').encode(), bcrypt.gensalt())
            user = User(
                    email=data.get('email'),
                    password=pwd.decode(),
                    full_name=data.get('full_name')
                    )
            db.session.add(user)
            db.session.commit()
            auth_token = user.encode_auth_token(user.id)
            respObj = {
                    'status':'success',
                    'message':'Successfully registered.',
                    'auth_token': auth_token.decode()
                    }
            return jsonify(respObj), 201
        except Exception as e:
            respObj = {
                    'status': 'fail',
                    'message': 'Some error occurred. Please try again.'
                    }
            return jsonify(respObj), 401
    else:
        respObj = {
                'status':'fail',
                'message': 'User already exists. Please log in.'
                }
        return jsonify(respObj), 202


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = User.query.filter_by(
                email=data.get('email')
                ).first()
        if user and bcrypt.checkpw(data.get('password').encode(), user.password.encode()):
            auth_token = user.encode_auth_token(user.id)
            if auth_token:
                responseObject = {
                        'status':'success',
                        'message':'Successfully logged in.',
                        'auth_token': auth_token.decode()
                        }
                return jsonify(responseObject)
        else:
            respObj = {
                    'status': 'fail',
                    'message': 'Bad username/password.'
                    }
            return jsonify(respObj), 401
    except Exception as e:
        responseObject = {
                'status': 'fail',
                'message': 'Try again'
                }
        return jsonify(responseObject)


@bp.route('/logout', methods=['GET'])
def logout():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
        except IndexError:
            respObj = {
                    'status':'fail',
                    'message':'Bearer token malformed.'
                    }
            return jsonify(respObj), 401
    else:
        auth_token = ''
    if auth_token:
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            blacklist_token = BlacklistToken(token=auth_token)
            try:
                db.session.add(blacklist_token)
                db.session.commit()
                responseObject = {
                        'status':'success',
                        'message':'Successfully logged out.'
                        }
                return jsonify(responseObject), 200
            except Exception as e:
                respObj = {
                        'status':'fail',
                        'message': e
                        }
                return jsonify(respObj), 200
        else:
            respObj = {
                    'status':'fail',
                    'message':resp
                    }
            return jsonify(respObj), 401
    else:
        respObj = {
                'status':'fail',
                'message':'Provide a valid auth token.'
                }
        return jsonify(respObj), 403

