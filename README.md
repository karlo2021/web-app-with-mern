# NodeJs

## Express

Express is the best way to run an HTTP server in the Node.js environment. For starters, we'll use Express to serve only static files.

We’ll serve the index.html file that we created in the previous section via Express.
We had installed Express in the previous step, but to ensure it’s there, let’s execute the npm command for installing it again. This command does nothing if the package is installed, so when in doubt, we can always run it again.

`npm install express@4`

To start using Express, let’s import the module and use the top-level function that the module exports, in order to instantiate an application.

```js
...
const express = require('express');
...
```

`require` is a JavaScript keyword specific to Node.js, and this is used to import other modules. In the previous line, we loaded up the module called express and saved the top-level thing that the module exports, in the constant named express. Node.js allows the thing to be a function, an object, or whatever can fit into a variable.

An Express application is web server that listens on a specific IP address and port.

```js
...
const app = express();
...
```

Now that we have a handle to the application, let’s set it up. Express is a framework that does minimal work by itself; instead, it gets most of the job done by functions called <i>middleware</i>

A middleware is a function that takes in an HTTP request and response object, plus the next middleware function in the chain. The function can look at and modify the request and response objects, respond to requests, or decide to continue with middleware chain by calling the next middleware function.
We need something that looks at a request and returns the contents of a file based on the request URL’s path. The built-in express.static function generates a middleware function that does just this. If a file exists, it returns the contents of the file as the response, if not, it chains to the next middleware function.

```js
...
const fileServerMiddleware = express.static('public');
...
```

The argument to the static() function is the directory where the middleware should look for the files, relative to where the app is being run

We’ll store all static files in the `public` directory under the root of our project. Let’s create this new directory, public, under the
project root and move index.html. Now, for the application to use the static middleware, we need to mount it on the application.
Middleware in an Express application can be mounted using the use() method. The first argument to this method is the base URL of any HTTP request to match. The second argument is the middleware function itself.

```js
...
app.use('/', fileServerMiddleware);
...
```

Finally, now that the application is set up, we’ll need to start the server and let it serve HTTP requests. The listen() method of the application starts the server and waits eternally for requests. It takes in a port number as the first argument. The listen() method also takes another argument, an optional callback that can be called when the server has been successfully started. 

```js
...
app.listen(3000, function(){
  console.log('App started on port 3000');
});
...
```

Let’s put all this together in a file called server.js in the root directory of the project.
To start the server, run it using the Node.js runtime like this,:

`node server.js`

You should see a message saying the application has started on port 3000. Open your browser and type [http://localhost:3000/index.html](http://localhost:3000/index.html) in the URL bar. You should see the same `Hello World` 

But what if we had a different starting point for the server? In fact, we want all the server-related files to go into a directory called server. So, let’s create that directory and move server.js into that directory. Now, if you run npm start, it will fail with an error. 

In order to let npm know that the entry point for the server, an entry needs to be added to the scripts section of package.json

<pre>
...
"main": "index.js",
"scripts": {
  <b>"start": "node server/server.js",</b>
  "test": "echo \"Error: no test specified\" && exit 1",
  },
...
</pre>

Note that there is also a field called main in package.json. When we initialized this file, the value of this field was set to index.js automatically. This field is not meant for indicating the starting point of the server. Instead, if the package was a module (as opposed to an application), index.js would have been the file to
load when the project is imported as a module using require() in other projects. Since this project is not a module that can be imported in other projects, this field is not of any interest to us, and neither do we have index.js in the source code.

Now, we can use `npm start`

