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
The GraphQL type system supports the following basic data types:
•	 Int: A signed 32-bit integer.
•	 Float: A signed double-precision floating-point value.
•	 String: A UTF-8 character sequence.
•	 Boolean: true or false.
•	 ID: This represents a unique identifier, serialized as a string. Using an ID instead of a string indicates that it is not intended to be human-readable.

In addition to specifying the type, the Schema Language has a provision to indicate whether the value is optional or mandatory. By default, all values are optional (i.e., they can be null), and those that require a value are defined by adding an exclamation character (!) after the type.
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
