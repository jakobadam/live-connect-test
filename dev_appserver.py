#!/usr/bin/python
import os
os.environ['SERVER_SOFTWARE'] = 'development'

from werkzeug import run_simple
from werkzeug import Response
from werkzeug import Request
from werkzeug.exceptions import BadRequest

root_path = os.path.abspath(os.path.dirname(__file__))

@Request.application
def app(request):
    if request.path == '/':
        return Response(file(os.path.join(root_path, "index.html")).read(),content_type="text/html")
    else:
        return BadRequest()

if __name__ == '__main__':
    from werkzeug import SharedDataMiddleware
    app = SharedDataMiddleware(app, {
            '/': root_path,
    })
    run_simple('localhost', 8080, app,use_debugger=False,use_reloader=True,threaded=False, processes=1)


