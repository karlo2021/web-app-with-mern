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

&nbsp;&nbsp; When a request is received, the first thing that Express does is match the request to one of the routes. The request method is matched against the route’s method. In the previous example, the route’s method is get() so any HTTP request using the GET method will match it. Further, the request URL is matched with the path specification, the first argument in the route, which is /hello. When a HTTP request matches this specification, the handler function is called. The route’s method and path need not be specific. If you want to match all HTTP methods, you could write app.all(). If you needed to match multiple paths, you could pass in an array of paths, or even a regular expression like '/*.do' will match any request ending with the extension .do. 

### Route Parameters

&nbsp;&nbsp; Route parameters are named segments in the path specification that match a part of the URL. If a match occurs, the value in that part of the URL is supplied as a variable in the request object.

`app.get('/coustomers/:coustomerId', ... );`

&nbsp;&nbsp; The URL /customers/1234 will match the route specification, and so will /customers/4567. In either case, the customer ID will be captured and supplied to the handler function as part of the request in req. params, with the name of the parameter as the key. Thus, req.params.customerId will have the value 1234 or 4567 for each of these URLs, respectively.

 >  The query string is not part of the path specification, so you cannot have different handlers for different parameters or values of the query string

### Route Lookup

