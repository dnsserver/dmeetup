import os
import tempfile
import pytest
import json

from dmeetup.factory import create_app
from dmeetup.database import db, User, Role

@pytest.fixture(scope="module")
def app(request):
    db_fd, temp_db_location = tempfile.mkstemp()
    config = {
            'DATABASE':temp_db_location,
            'SQLALCHEMY_DATABASE_URI':'sqlite:///{}'.format(temp_db_location),
            'SQLALCHEMY_ECHO':False,
            'TESTING': True,
            }
    app = create_app(config=config)
    with app.app_context():
        db.init_app(app)
        db.create_all()
        admin_role = Role(name='admin')
        db.session.add(admin_role)
        user_role = Role(name='user')
        db.session.add(user_role)
        db.session.commit()

        yield app


@pytest.fixture(scope="module")
def client(request, app):
    client = app.test_client()
    def teardown():
        os.unlink(app.config['DATABASE'])
    request.addfinalizer(teardown)
    return client


def login(client, email, password):
    return client.post('/auth/login', data=json.dumps(dict(
        email=email,
        password=password
        )), content_type='application/json',
        follow_redirects=True)


def logout(client):
    return client.get('/auth/logout',
            headers=dict(
                Authorization='Bearer '+ client.token
            ))


def test_bad_register(client):
    rv = client.post('/auth/register', data=json.dumps(dict(
        email='denis1@denib.com',
        )), content_type='application/json')
    resp = json.loads(rv.data.decode())
    assert resp['status'] == "fail"
    assert resp['message'] == "Please provide a username/password and full name."


def test_register(client):
    rv = client.post('/auth/register', data=json.dumps(dict(
        email='denis1@denib.com',
        password='123',
        )), content_type='application/json')
    resp = json.loads(rv.data.decode())
    assert resp['status'] == "success"


def test_bad_login(client, app):
    rv = login(client, 'denis1@denib.com', '12a')
    resp = json.loads(rv.data.decode())
    assert resp['status'] == "fail"


def test_login(client, app):
    rv = login(client, 'denis1@denib.com', '123')
    resp = json.loads(rv.data.decode())
    assert resp['status'] == "success"
    client.token = resp['auth_token']


def test_userinfo(client):
    rv = client.get('/api/userinfo',
            headers=dict(
                Authorization='Bearer '+ client.token
            ))
    resp = json.loads(rv.data.decode())
    assert resp['status'] == 'success'
    assert resp['data'] is not None
    assert resp['data']['email'] == 'denis1@denib.com'


def test_logout(client, app):
    rv = logout(client)
    resp = json.loads(rv.data.decode())
    assert resp['status'] == 'success'


