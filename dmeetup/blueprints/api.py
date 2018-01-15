from flask import jsonify, Blueprint, g, request

from ..database import User
from ..utils import require_authentication

bp = Blueprint('api', __name__)

@bp.route('/')
def index():
    return jsonify({
        "message":"hello there"
    })


@bp.route('/userinfo')
@require_authentication
def userinfo():
    respObject = {
            'status': 'success',
            'data': {
                'user_id': g.user.id,
                'email': g.user.email,
                'full_name': g.user.full_name
                }
            }
    return jsonify(respObject)

