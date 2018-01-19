from setuptools import setup, find_packages

setup(
    name='dmeetup',
    packages=['dmeetup'],
    include_package_data=True,
    install_requires=[
        'click',
        'requests',
        'flask',
        'sqlalchemy<1.2',
        'flask_sqlalchemy',
        'flask_admin',
        'flask_oidc',
        'flask_nav',
        'flask-cors',
        'pyopenssl',
        'pyjwt',
        'bcrypt',
    ],
    setup_requires=[
        'pytest-runner',
    ],
    tests_require=[
        'pytest',
    ],
)

