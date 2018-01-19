DMeetup
=======


Init
----

```
virtualenv .
source bin/activate
pip install -e .
python wsgi.py
```


Test
----

```
source bin/activate
cd tests
pytest
```

Frontend
--------

```
cd dmeetup/frontend
npm run build
```


Features
--------

- Feed
- Connections
- Private messages
- Connection Request/Approve/Decline

