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
    password = db.Column(db.String(50), nullable=False)
    full_name = db.Column(db.String(200), nullable=True)
    pets = db.relationship('Pet', backref='user', lazy=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=True)

    def __repr__(self):
        return self.email

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

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    street = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(2))
    zipcode = db.Column(db.String(10))
    lat = db.Column(db.String(100))
    lon = db.Column(db.String(100))
    submitted_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    approved = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return self.name


# Customized Admin views
class PetView(sqla.ModelView):
    inline_models = (Attribute,)


admin = admin.Admin()
admin.add_view(sqla.ModelView(User, db.session))
admin.add_view(sqla.ModelView(Role, db.session))
admin.add_view(PetView(Pet, db.session))
admin.add_view(sqla.ModelView(Location, db.session))


