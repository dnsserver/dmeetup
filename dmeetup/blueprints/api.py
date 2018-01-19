from flask import jsonify, Blueprint, g, request

from ..database import User, Feed, db
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


@bp.route('/feed', methods=['POST'])
@require_authentication
def post_location():
    data = request.get_json()
    respObj = {'status':'fail'}
    if "content" not in data:
        respObj['message'] = 'Please provide content.'
        return jsonify(respObj), 400

    feed = Feed(
            feed_type=data.get('feed_type'),
            feed_content=data.get('feed_content'),
            lat=data.get('lat'),
            lon=data.get('lng'),
            submitted_by=g.user.id
            )
    db.session.add(feed)
    db.session.commit()
    respObj['status'] = 'success'
    respObj['message'] = 'Feed with id:{} was created'.format(feed.id)
    return jsonify(respObj), 200






