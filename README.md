# About Api

Let’s start with a simple API that returns a string, called About. In this section, we’ll implement this API as well as another API that lets us change the string that is returned by this API. This will let you learn the basics of simple reads as well as writes using GraphQL.<br />
Before we start writing the code for it, we need the npm packages for graphql-tools, apollo-server, and the base package graphql that these depend on. The package graphql-tools is a dependency of apollo-server-express, so we don’t have to specify it explicitly, whereas graphql is a peer dependency that needs to be installed separately

`npm install graphql@0 appolo-server-express@2`

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
