from flask import request, jsonify, g
from .database import User

def require_authentication(func):
    def func_wrapper():
        auth_header = request.headers.get('Authorization')
        auth_token = None
        if auth_header:
            token_parts = auth_header.split(" ")
            if len(token_parts) == 2:
                auth_token = token_parts[1]
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                user = User.query.filter_by(id=resp).first()
                g.user = user
                return func()
            respObject = {
                    'status': 'fail',
                    'message': resp
                    }
            return jsonify(respObject)
        else:
            respObj = {
                    'status': 'fail',
                    'message':'Provide a valid auth token.'
                    }
            return jsonify(respObj)

    return func_wrapper

 
