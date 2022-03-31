// An Express application is web server that listens on a specific IP address and port
const express = require('express');

/*At this point in time, we need something that looks at a request and returns the contents of a file based
on the request URL’s path. The built-in express.static function generates a middleware function that does
just this. It responds to a request by trying to match the request URL with a file under a directory specified
by the parameter to the generator function. If a file exists, it returns the contents of the file as the response, if
not, it chains to the next middleware function. This is how we can create the middleware: */
const app = express();

/*
Now, for the application to use the static middleware, we need to mount it on the application.
Middleware in an Express application can be mounted using the use() method of the application. The
first argument to this method is the base URL of any HTTP request to match. The second argument is the
middleware function itself. Thus, to use the static middleware, we can do this:
...
app.use('/', fileServerMiddleware);
*/
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Listening on port 3000');
});