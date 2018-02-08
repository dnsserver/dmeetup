from flask_sqlalchemy import SQLAlchemy

import flask_admin as admin
from flask_admin.contrib import sqla
from flask import current_app

import jwt
import datetime

db = SQLAlchemy()

class BlacklistToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    @staticmethod
    def check_blacklist(auth_token):
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    full_name = db.Column(db.String(200), nullable=True)
    pets = db.relationship('Pet', backref='user', lazy=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=True)

    def __repr__(self):
        return self.email

    def json_obj(self):
        return {
                'id': self.id,
                'email': self.email,
                'full_name': self.full_name,
                'role_id': self.role_id
                }

    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                    'iat': datetime.datetime.utcnow(),
                    'sub': user_id
            }
            return jwt.encode(
                    payload,
                    current_app.config['SECRET_KEY'],
                    algorithm='HS256'
                    )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, current_app.config['SECRET_KEY'])
            is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted_token:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again'


    

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    users = db.relationship('User', backref='role', lazy=True)

    def __repr__(self):
        return self.name


class Attribute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), nullable=False)
    val = db.Column(db.Text)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)

    def __repr__(self):
        return "{}:{}={}".format(self.id,self.key, self.val)


class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    attributes = db.relationship('Attribute', backref='pet', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return self.name


class Feed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feed_type = db.Column(db.String(50), nullable=False)
    feed_content = db.Column(db.Text, nullable=False)
    lat = db.Column(db.String(100))
    lon = db.Column(db.String(100))
    submitted_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    submitted_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    def __repr__(self):
        return self.name

    def json_obj(self):
        return {
                'id': self.id,
                'feed_type': self.feed_type,
                'feed_content': self.feed_content,
                'lat': self.lat,
                'lon': self.lon,
                'submitted_by': self.submitted_by,
                'submitted_at': self.submitted_at
                }


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sent_time = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    read = db.Column(db.Boolean, default=False)

    def __init__(self, sender, receiver, message):
        self.sender = sender
        self.receiver = receiver
        self.message = message
        self.send_time = datetime.datetime.utcnow()
        self.read = False

    def json_obj(self):
        return {
                'id': self.id,
                'sender': self.sender,
                'receiver': self.receiver,
                'message': self.message,
                'sent_time': self.sent_time,
                'read': self.read
                }


class ConnectionRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sender_message = db.Column(db.String(200), nullable=True)
    request_status = db.Column(db.String(50), nullable=True)
    sent_time = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    def __init__(self, sender, receiver, message):
        self.sender = sender
        self.receiver = receiver
        self.sender_message = message
        self.request_status = "init"
        self.sent_time = datetime.datetime.utcnow()

    def json_obj(self):
        return {
                'id':self.id,
                'sender':self.sender,
                'receiver':self.receiver,
                'sender_message':self.sender_message,
                'request_status':self.request_status,
                'sent_time':self.sent_time
                }


# Customized Admin views
class PetView(sqla.ModelView):
    inline_models = (Attribute,)


class UserView(sqla.ModelView):
    column_exclude_list = ['password',]
    column_editable_list = ['email','full_name', 'pets','role_id']
    form_excluded_columns = ['password',]


admin = admin.Admin()
admin.add_view(UserView(User, db.session))
admin.add_view(sqla.ModelView(Role, db.session))
admin.add_view(PetView(Pet, db.session))
admin.add_view(sqla.ModelView(Feed, db.session))
admin.add_view(sqla.ModelView(Message, db.session))
admin.add_view(sqla.ModelView(ConnectionRequest, db.session))

