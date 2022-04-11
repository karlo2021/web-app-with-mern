# Express & GraphQL

&nbsp;&nbsp; Until now, the only resource the Express and Node.js server was serving was static content in the form of index.html. In this chapter, we’ll start fetching and storing the data using APIs from the Express and Node.js server in addition to the static HTML file. This will replace the hard-coded array of issues in the browser’s memory.

We will not persist the data on disk; instead, we’ll just use a simulated database in the server’s memory. We will leave actual persistence to the next chapter.

## Express

&nbsp;&nbsp; In the Hello World chapter we saw how to serve static files using Express. Express is a minimal, yet, flexible web application framework. It’s minimal in the sense that by itself, Express does very little. It relies on other modules called middleware to provide the functionality that most applications will need.

### Routing

&nbsp;&nbsp; At the heart of Express is a router, which essentially takes a client request, matches it against any routes that are present, and executes the handler function that is associated with that route.<br />
&nbsp;&nbsp; A route specification consists of an HTTP method (GET, POST, etc.), a path specification that matches the request URI, and the route handler. The handler is passed in a request object and a response object. The request object can be inspected to get the various details of the request, and the response object’s methods
can be used to send the response to the client.<br />
&nbsp;&nbsp; We already have an Express application in the which we created using the express() function. We also installed a middleware for handling static files. A middleware function deals with any request matching the path specification, regardless of the HTTP method. In contrast, a route can match a request with a specific HTTP method. So, instead of app.use(), app.get() has to be used in order to match the GET HTTP method. Further, the handler function, the second argument that the routing function takes, can set the response to be sent back to the caller

```js
...
app.get('/hello', (req, res) => {
  res.send('hello world');
});
...
```

### Request Matching

&nbsp;&nbsp; When a request is received, the first thing that Express does is match the request to one of the routes. The request method is matched against the route’s method. In the previous example, the route’s method is get() so any HTTP request using the GET method will match it. Further, the request URL is matched with the path specification, the first argument in the route, which is /hello. When a HTTP request matches this specification, the handler function is called. The route’s method and path need not be specific. If you want to match all HTTP methods, you could write app.all(). If you needed to match multiple paths, you could pass in an array of paths, or even a regular expression like `'/*.do'` will match any request ending with the extension .do. 

### Route Parameters

&nbsp;&nbsp; Route parameters are named segments in the path specification that match a part of the URL. If a match occurs, the value in that part of the URL is supplied as a variable in the request object.

`app.get('/coustomers/:coustomerId', ... );`

&nbsp;&nbsp; The URL /customers/1234 will match the route specification, and so will /customers/4567. In either case, the customer ID will be captured and supplied to the handler function as part of the request in req. params, with the name of the parameter as the key. Thus, req.params.customerId will have the value 1234 or 4567 for each of these URLs, respectively.

 > The query string is not part of the path specification, so you cannot have different handlers for different parameters or values of the
 > query string

### Route Lookup

&nbsp;&nbsp; Multiple routes can be set up to match different URLs and patterns. The router does not try to find a best match; instead, it tries to match all routes in the order in which they are installed. The first match is used. So, if two routes are possible matches to a request, it will use the first defined one. So, the routes have to be defined in the order of priority. <br />
Thus, if you add patterns rather than very specific paths, you should be careful to add the more generic pattern after the specific paths in case a request can match both. For example, if you want to match everything that goes under /api/, that is, a pattern like `/api/*`, you should add this route only after all the more specific routes that handle paths such as `/api/issues`.

### Handler Function

Once a route is matched, the handler function is called The parameters passed to the handler are a request object and a response object. The handler function is not expected to return any value. But it can inspect the request object and send out a response as part of the response object based on the request parameters.

### Request Object

Any aspect of the request can be inspected using the request object’s properties and methods. A few important and useful properties and methods are listed here

•	`req.params:` This is an object containing properties mapped to the named route parameters. The property’s key will be the name of the route parameter (customerId in this case) and the value will be the actual string sent as part of the HTTP request. <br /><br />
•	`req.query:` This holds a parsed query string. It’s an object with keys as the query string parameters and values as the query string values. Multiple keys with the same name are converted to arrays, and keys with a square bracket notation result in nested objects<br />
e.g., order[status]=closed can be accessed as req.query.order.status <br /><br/>
•	`req.header, req.get(header):` The get method gives access to any header in the request. The header property is an object with all headers stored as key-value pairs. <br /><br />
•	`req.path:` This contains the path part of the URL, that is, everything up to any ? that starts the query string. Usually, the path is part of the route specification, but if the path is a pattern that can match different URLs, you can use this property to get the actual path that was received in the request.
<br /><br /> 
•	`req.url, req.originalURL:` These properties contain the complete URL, including the query string. Note that if you have any middleware that modifies
the request URL, originalURL will hold the URL as it was received, before the modification.<br /><br />
•	`req.body:` This contains the body of the request, valid for POST, PUT, and PATCH requests. Note that the body is not available (req.body will be undefined) unless a middleware is installed to read and optionally interpret or parse the body.<br />

There are many other methods and properties; for a complete list, refer to the Request documentation of Express at http://expressjs.com/en/api.html#req as well as Node.js’ request object at https://nodejs.org/api/http.html#http_class_http_incomingmessage, from which the Express Request is extended.

### Response Object

The response object is used to construct and send a response. Note that if no response is sent, the client is left waiting.

•	`res.send(body):` You already saw the res.send() method briefly, which responded with a string. This method can also accept a buffer (in which case the content type is set as application/octet-stream as opposed to text/html in case of a string). If the body is an object or an array, it is automatically converted to a JSON string with an appropriate content type.<br/><br />
•	`res.status(code):` This sets the response status code. If not set, it is defaulted to 200 OK. One common way of sending an error is by combining the status() and send()<br /><br />
•	`res.json(object):` This is the same as res.send(), except that this method forces conversion of the parameter passed into a JSON, whereas res.send() may treat
some parameters like null differently. methods in a single call like res.status(403).send("Access Denied"). <br /><br />
•	`res.sendFile(path):` This responds with the contents of the file at path.<br /><br />
