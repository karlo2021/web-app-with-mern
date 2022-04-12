# GraphQL-Schema-File

In the previous section, we specified the GraphQL schema within the JavaScript file. If and when the schema grows bigger, it would be useful to separate the schema into a file of its own. This will help keep the JavaScript source files smaller, and IDEs may be able to format these files and enable syntax coloring. Let’s create a file called schema.graphql and move the contents of the string typeDefs into it:
<br />_schema.graphql: New File for GraphQL Schema_

```js
type Query {
  about: String!
}
type Mutation {
  setAboutMessage(message: String!): String!
}
```

Now, to use this instead of the string variable, this file’s contents have to be read into a string. Let’s use the fs module and the readFileSync function to read the file. Then, we can use the string that readFileSyc returned as the value for the property typeDefs when creating the Apollo Server. 

<pre>
<b>const fs = require('fs');</b>
const express = require('express');
...
<del>const typeDefs = `
  type Query {
    about: String!
  }
  type Mutation {
    setAboutMessage(message: String!): String!
  }
`;</del>
...
const server = new ApolloServer({
  typeDefs: <b>fs.readFileSync('./server/schema.graphql', 'utf-8')</b>,
  resolvers
});
...
</pre>

There’s just one other thing that needs a change: the nodemon tool that restarts the server on detecting
changes to files by default only looks for changes to files with a .js extension. To make it watch for changes to other extensions, we need to add an -e option specifying all the extensions it needs to watch for. Since we added a file with extension .graphql, let’s specify js and graphql as the two extensions for this option

<pre>
...
  "scripts": {
    "start": "nodemon -w server <b>-e js,graphql</b> server/server.js",
    "compile": "babel src --out-dir public",
...
</pre>
