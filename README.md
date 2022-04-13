# About Api

Let’s start with a simple API that returns a string, called About. In this section, we’ll implement this API as well as another API that lets us change the string that is returned by this API. This will let you learn the basics of simple reads as well as writes using GraphQL.<br />
Before we start writing the code for it, we need the npm packages for graphql-tools, apollo-server, and the base package graphql that these depend on. The package graphql-tools is a dependency of apollo-server-express, so we don’t have to specify it explicitly, whereas graphql is a peer dependency that needs to be installed separately

`npm install graphql@0 apollo-server-express@2`

Now, let’s define the schema of the APIs that we need to support. The GraphQL schema language requires us to define each type using the type keyword followed by the name of the type, followed by its specification within curly braces. For example, to define a User type containing a string for the user’s name, this is the specification in the schema language:

```js
...
type User{
  name: String
}
...
```

For the About API, we don’t need any special types, just the basic data type String is good enough. But GraphQL schema has two special types that are entry points into the type system, called Query and Mutation. All other APIs or fields are defined hierarchically under these two types, which are like the entry points into the API. Query fields are expected to return existing state, whereas mutation fields are expected to change something in the application’s data.<br />

A schema must have at least the Query type. The distinction between the query and mutation types is notional: there is nothing that you can do in a query or mutation that you cannot do in the other. But a subtle difference is that whereas query fields are executed in parallel, mutation fields are executed in series. So,
it’s best to use them as they are meant to be used: implement READ operations under Query and things that modify the system under Mutation.
The GraphQL type system supports the following basic data types:<br />
•	 Int: A signed 32-bit integer.<br />
•	 Float: A signed double-precision floating-point value.<br />
•	 String: A UTF-8 character sequence.<br />
•	 Boolean: true or false.<br />
•	 ID: This represents a unique identifier, serialized as a string. Using an ID instead of a string indicates that it is not intended to be human-readable.

In addition to specifying the type, the Schema Language has a provision to indicate whether the value is optional or mandatory. By default, all values are optional (i.e., they can be null), and those that require a value are defined by adding an exclamation character (!) after the type.<br />
In the About API, all we need is a field called about under Query, which is a string and a mandatory one. Note that the schema definition is a string in JavaScript. We’ll use the template string format so that we can smoothly add newlines within the schema. 

```js
...
const typeDefs = `
  typeQuerry{
    about: String!
  }
`;
...
```

We’ll use the variable typeDefs when we initialize the server, but before that, let’s also define another field that lets us change the message and call this setAboutMessage. But this needs an input value for the new message that we will receive. Such input values are specified just like in function calls: using
parentheses. Thus, to indicate that this field needs a mandatory string input called message, we need to write:

```js
...
setAboutMessage(message: String!);
...
```

Note that all arguments must be named. There are no positional arguments in the GraphQL Schema Language. Also, all fields must have a type, and there is no void or other type that indicates that the field returns nothing. To overcome this, we can just use any data type and make it optional so that the caller does not expect a value.

Let’s use a string data type as the return value for the setAboutMessage field and add it to the schema under the Mutation type. Let’s also name the variable that contains the schema typeDefs and define it as a string in server.js:

```js
...
const typeDefs = `
  typeQuery {
    about: String!
  }
  typeMutation {
    setAboutMessage(message: String!): String
  }
`;
...
```

Note that I stopped calling these APIs, rather I am calling even something like setAboutMessage a field. That’s because all of GraphQL has only fields, and accessing a field can have a side effect such as setting some value.

The next step is to have handlers or functions that can be called when these fields are accessed. Such functions are called _resolvers_ because they resolve a query to a field with real values. Although the schema definition was done in the special Schema Language, the implementation of resolvers depends on the programming language that we use. For example, if you were to define the About API set, say, in Python, the schema string would look the same as in JavaScript. But the handlers would look quite different from what we are going to write in JavaScript.<br />
In the Apollo Server as well as in graphql-tools, resolvers are specified as nested objects that follow the structure of the schema. At every leaf level, the field needs to be resolved using a function of the same name as the field. Thus, at the topmost level, we’ll have two properties named Query and Mutation in the resolver. 

```js
...
const resolvers = {
  Query: {
  },
  Mutation: {
  },
};
...
```

Within the Query object, we’ll need a property for about, which is a function that returns the About message. Let’s first define that message as a variable at the top of the file. Since we will change the value of the message within the setAboutMessage field, we’ll need to use the let keyword rather than const.

```js
...
let aboutMessage = "Issue Tracket API v1.0";
...
```

Now, all the function needs to do is return this variable. A simple arrow function that takes no arguments should do the trick:

```js
...
Query: {
  about: () => aboutMessage,
},
...
```

The setAboutMessage function is not so simple since we’ll need to receive input arguments. All resolver functions are supplied four arguments like this:

`fileName(obj, args, context, info);`

The arguments are described here:<br />
•	 obj: The object that contains the result returned from the resolver on the parent field. This argument enables the nested nature of GraphQL queries<br />
•	 args: An object with the arguments passed into the field in the query. For example, if the field was called with setAboutMessage(message: "New Message"), the args
object would be: { "message": "New Message" }.<br />
•	context: This is an object shared by all resolvers in a particular query and is used to contain per-request state, including authentication information, dataloader
instances, and anything else that should be taken into account when resolving the query.<br />
•	 info: This argument should only be used in advanced cases, but it contains information about the execution state of the query.<br />

The return value should be of the type that is specified in the schema. In the case of the field setAboutMessage, since the return value is optional, it can choose to return nothing. But it’s good practice to return _some_ value to indicate successful execution of the field, so let’s just return the message input value.
We will also not be using any properties of the parent object (Query) in this case, so we can ignore the first argument, obj, and use only the property within args. Thus, the function definition for setAboutMessage looks like this:

```js
...
function setAboutMessage(_, {message}) {
  return aboutMessage = message;
}
...
```

 > We used the ES2015 Destructuring Assignment feature to access the message property present inside the second argument called args. This is equivalent to naming the 
 > argument as args and accessing the property as args.message rather than simply message.

Now, we can assign this function as the resolver for setAboutMessage within the Mutation top-level field like this:

```js
...
Mutation: {
  setAboutMessage,
},
...
```

 > We used the ES2015 Object Property Shorthand to specify the value of the setAboutMessage property. When the property name and the variable name assigned to it are 
 > the same, the variable name can be skipped. Thus, { setAboutMessage: setAboutMessage } can be simply written as { setAboutMessage }.

Now that we have the schema defined as well as the corresponding resolvers, we are ready to initialize the GraphQL server. The way to do this is to construct an ApolloServer object defined in the apolloserver-express package. The constructor takes in an object with at least two properties—typeDefs and resolvers—and returns a GraphQL server object.

```js
...
const  { ApolloServer } = require('apollo-server-express');
...
const server = new ApoloServer({
  typeDefs,
  resolvers
});
...
```

Finally, we need to install the Apollo Server as a middleware in Express. We need a path (the single endpoint) where we will mount the middleware. But, the Apollo Server is not a single middleware; there are in fact a group of middleware functions that deal with different HTTP methods differently. The ApolloServer object gives us a convenience method that does all this for us, called applyMiddleware. It takes in a configuration object as its argument that configures the server, of which two important properties are app and path. Thus, to install the middleware in the Express application, let’s add the following code:

`server.applyMiddleware({app, path: 'graphql/' });`

After putting all this together, we should have a working API server. The new contents of server.js are shown

```js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

let aboutMessage = "Issue Tracker API v1.0";

cosnt typeDefs = `
  type Query{
    about: String!
  }
  type Mutation {
    setAboutmessage(message: String!): String
  }
`;

cosnt resolvers = {
  Query: {
    about: () => aboutMessage,
  },
  Mutation {
    setAboutMessage,
  },
};

function setAboutMessage(_, {message}) {
  return setAboutMessage(message);
}

cosnt server = new ApolloServer({
  typeDef,
  resolvers
})

const app = express();

app.use(express.static('public/'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, () => {
  cosnole.log('Server listening on port 3000');
});
```
  
GraphQL schema and introspection allows tools to be built that can let developers explore the API. The tool called Playground is available by default as part of the Apollo Server and can be accessed simply by browsing the API endpoint. Thus, if you type http://localhost:3000/graphql in your browser’s URL bar, you’ll find the Playground UI.
  
The default for the Playground is a dark theme. Using the settings function (gear icon in the top-right
corner), I have changed it to a light theme as well as reduced the font size to 12. 

<img src="./resources/graphql-playground.JPG" width="860" height="385" >
  
Before we test the APIs, it’s a good idea to explore the schema using the green SCHEMA button on the
right side of the UI. On doing that, you’ll find that the about and setAboutMessage fields are described in the schema. To make a query, you can type the query in the left-side window and see the results on the right side after clicking on the Play button

The query language has to be used to write the query. The language is JSON-like, but is not JSON. The
query needs to follow the same hierarchical structure of the schema and is similar to it. But we don’t specify the types of the fields, just their names. In case of input fields, we specify the name and value, separated by a colon (:). Thus, to access the about field, a top-level query has to be used, which contains nothing but the field we need to retrieve, that is about.
  
```js
query {
  about
}
```

Note that there is an autocompletion feature in the Playground, which may come in handy as you type.
The Playground also shows errors in the query using red underlines. These features use the schema to know
about the available fields, arguments, and their types. The Playground queries the schema from the server, so whenever the schema changes, if you rely on autocompletion, you need to refresh the browser so that the changed schema is retrieved from the server. <br />

Since by default all queries are of type Query (as opposed to Mutation), we can skip the keyword query
and just type { about }. But to keep it clear, let’s always include the query keyword. On clicking the Play button, you will find the following output on the results window on the right side:

```json
{
  "data": {
    "about": "Issue Tracker API v1.0"
  }
}
```

The output is a regular JSON object unlike the query. Now to test the setAboutMessage field, you can replace the query with a mutation, or better still, you can open a new tab using the + symbol in the UI and type in the mutation query like this:

```js
mutation {
  setAboutMessage(message: "Hello World");
}
```

Running this query should result in returning the same message as the result, like this:

```json
{
  "data": {
    "setaboutMessage": "Hello World"
  }
}
```

Now, running the original about query (in the first tab) should return the new message, "Hello
World!" to prove that the new message has been successfully set in the server. To assure ourselves that there is no magic that the Playground is doing, let’s also run a query using cURL on the command line for the about field.

A quick way to do this is to copy the command using the COPY CURL button in the Playground and
paste it in the command shell. (On a Windows system, the shell does not accept single quotes, so you have
to manually edit and change single quotes to double quotes and then escape the double quotes within the
query using a backslash.) The command and its output will be as follows:

```
curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H
'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive'
-H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"query {\n about\
n}\n"}' –compressed
{"data":{"about":"Hello World!"}}
```

Further, if you look at the headers (or understand the curl command), you will also find that for
both the setAboutMessage mutation as well as the about query, the HTTP method used was the same:
POST. It may feel a little disconcerting to use a POST method for fetching values from the server, so if
you prefer a GET, you could use that instead. The query string of the GET URL can contain the query
like this:

`curl 'http://localhost:3000/graphql?query=query+\{+about+\}'`
