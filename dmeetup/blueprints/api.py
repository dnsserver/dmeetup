from flask import jsonify, Blueprint, g, request
from sqlalchemy import or_, and_

from ..database import User, Feed, db, ConnectionRequest, Message
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
            'data': g.user.json_obj()
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


@bp.route('/user', methods=['GET'])
@require_authentication
def search_users():
    name = request.args.get('filter', default = '', type = str)
    respObj = {'status':'fail'}
    if not name or len(name) < 4:
        respObj['message'] = 'Please provide a filter (longer than 3 chars).'
        return jsonify(respObj), 400

    users = User.query.filter(or_(User.full_name.contains(name), User.email.contains(name))).all()
    respObj['status'] = 'success'
    respObj['data'] = [user.json_obj() for user in users]
    return jsonify(respObj), 200


@bp.route('/connect', methods=['POST'])
@require_authentication
def connect_request():
    data = request.get_json()
    if "receiver" not in data or 'message' not in data:
        respObj = {
                'status':'fail',
                'message': 'Wrong request'
                }
        return jsonify(respObj), 400

    conn_req = ConnectionRequest(g.user.id, data['receiver'], data['message'])
    db.session.add(conn_req)
    db.session.commit()
    respObj = {
            'status':'success',
            'message':'Request submitted.',
            'data':conn_req.id
            }
    return jsonify(respObj), 200

@bp.route('/connection_requests', methods=['GET'])
@require_authentication
def connect_request_list():
    reqs = ConnectionRequest.query.filter_by(receiver=g.user.id).all()

    respObj = {
            'status':'success',
            'message':'Request submitted.',
            'data': [req.json_obj() for req in reqs]
            }
    return jsonify(respObj), 200


@bp.route('/messages', methods=['GET'])
@require_authentication
def messages():
    msgs = Message.query.filter_by(receiver=g.user.id).all()

    respObj = {
            'status':'success',
            'message':'Request submitted.',
            'data': [msg.json_obj() for msg in msgs]
            }
    return jsonify(respObj), 200



