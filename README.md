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

