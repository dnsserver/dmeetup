from flask import jsonify, Blueprint, g, request

from ..database import User, Location, db
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


@bp.route('/location', methods=['POST'])
@require_authentication
def post_location():
    data = request.get_json()
    respObj = {'status':'fail'}
    if "name" not in data:
        respObj['message']='Please provide a name.'
        return jsonify(respObj), 400
    if "lat" not in data or 'lng' not in data:
        respObj['message'] = 'Please provide lat/lng.'
        return jsonify(respObj), 400

    location = Location(
            name=data.get('name'),
            lat=data.get('lat'),
            lon=data.get('lng'),
            submitted_by=g.user.id
            )
    db.session.add(location)
    db.session.commit()
    respObj['status'] = 'success'
    respObj['message'] = 'Location with id:{} was created'.format(location.id)
    return jsonify(respObj), 200






