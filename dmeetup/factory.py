import click

from flask import Flask, render_template, session, g, request, abort, _app_ctx_stack as stack, jsonify
from flask_nav import Nav
from flask_nav.elements import Navbar, View

from werkzeug.utils import find_modules, import_string

from .database import db, admin, User, Role


def create_app(config=None):
    app = Flask('dmeetup')
    app.config.update(dict(
        DEBUG=True,
        TESTING=True,
        SECRET_KEY=b'this_is_secret_4ever',
        SQLALCHEMY_DATABASE_URI='sqlite:///dmeetup.db',
        SQLALCHEMY_ECHO=True,
        SQLALCHEMY_TRACK_MODIFICATIONS=True,
    ))
    app.config.update(config or {})
    app.config.from_envvar('DMEETUP_SETTINGS', silent=True)

    register_teardowns(app)
    load_db(app)
    admin.init_app(app)

    register_nav(app)
    register_blueprints(app)
    return app


def load_db(app):
    ctx = stack.top
    db.init_app(app)
    if ctx and not  getattr(ctx, '_database', None):
        ctx._database = True
        

def register_nav(app):
    nav = Nav()

    @nav.navigation()
    def dmeetup_navbar():
        items = list()
        items.append(View('Home', 'index'))

        return Navbar('D-Meetup', *items)
    nav.init_app(app)


def register_blueprints(app):
    for name in find_modules('dmeetup.blueprints'):
        mod = import_string(name)
        if hasattr(mod, 'bp'):
            prefix = "/{}".format(mod.bp.name)
            app.register_blueprint(mod.bp, url_prefix=prefix)
    return None

def register_teardowns(app):
    @app.teardown_appcontext
    def close_db(error):
        ctx = stack.top
        if ctx and hasattr(ctx, '_database'):
            ctx.pop('_database',None)

app = create_app()

@app.cli.command('initdb')
def initdb_command():
    """
    Creates the tables
    """
    db.create_all()
    click.echo("Database initialized")


@app.route('/')
def index():
    return render_template('index.html')


