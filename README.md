# Input Validations

We have kind of ignored validation up until now. But all applications have some typical validations required, not just to prevent invalid input from the UI, but also to prevent invalid inputs from direct API calls.
A common validation is where the set of allowed values is restricted, one that can be shown in a
dropdown. The status field in the Issue Tracker application is one such field. One way to implement this
validation is adding a check against an array of allowed values as part of the issueAdd resolver. But the
GraphQL schema itself gives us an automatic way of doing this via enumeration types or enums. An enum
definition in the schema looks like this:

```cs
...
enum Color {
    Red
    Green
    Blue
}
...
```

Note that while the definition may translate to actual enum types in other languages, since JavaScript
does not have enum types, these will be dealt with as strings, both in the client as well as in the server. Let’s add this enum type for status called StatusType:

```cs
...
enum StatusType {
    New
    Assigned
    Fixed
    Closed
}
...
```

Now, we can replace the type String with StatusType

```js
...
type Issue {
    ...
    status: StatusType!
    ...
}
```

The same can be done in the IssueInput type. But one notable feature of the GraphQL schema is that it
allows us to supply default values in case the input has not given a value for an argument. This can be done by adding an = symbol and the default value after the type specification, like owner: String = "Self". In the case of status, the default value is an enum, so it can be specified without the quotes like this:

```js
...
    status: StatusType = New
...
```

Now, we can remove the defaulting of issue.status to 'New' within the issueAdd resolver in server.js.
The set of all changes to the schema.graphql file is shown

<pre>
scalar GraphQLDate

enum StatusType {
    New
    Assigned
    Fixed
    Closed
}

type Issue {
    ...
    status: <del>Stirng</del><b>StatusType!</b>
    ...
}
...
input IssueInput {
    ...
    status: <del>String</del><b>StatusType = New</b>
    owner: String
    effort: Int
    due: GraphQLDate
}
</pre>

As for programmatic validations, we have to have them before saving a new issue in server.js. We’ll do
this in a separate function called validateIssue(). Let’s first create an array to hold the error messages of failed validations. When we find multiple validation failures, we’ll have one string for each validation failure message in this array.

<pre>
...
function validateIssue(_, { issue }) {
    <b>const errors = [];</b>
...
</pre>

Next, let’s add a minimum length for the issue’s title.

```js
...
    if (issue.title.length > 3){
        errors.push('Field "title" must be at least 3 characters long');
    }
...
```

Let’s also add a conditional mandatory validation, one that checks for the owner being required when
the status is set to Assigned. The UI has no way of setting the status field at this stage, so to test this, we will use the Playground.

```js
...
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
...
```

At the end of the checks, if we find that the errors array is not empty, we’ll throw an error. The Apollo
Server recommends using the UserInputError class to generate user errors.

```js
...
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
...
```

Now, let’s add one more validation that we missed doing earlier: catch invalid date strings while
parsing the value on the way in. The new Date() constructor does not throw any errors when the date
string is invalid. Instead, it creates a date object, but the object contains an invalid date. One way to detect input errors is by checking if the constructed date object is a valid value. It can be done using the check isNaN(date), after constructing the date. Let’s implement this check in parseValue as well as parseLiteral:

```js
...
parseValue(value) {
    const dateValue = new Date(value)
    retrun isNaN(dateValue) ? undefined : dateValue; 
},
parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
        const value = new Date(ast.value);
        return isNaN(value) ? undefined : value;
    }
},
...
```

Note that returning undefined is treated as an error by the library. If the supplied literal is not a string, the function will not return anything, which is the same as returning undefined.

Finally, you’ll find that though all errors are being sent to the client and shown to the user, there is no way to capture these at the server for analysis at a later point in time. In addition, it would be nice to monitor the server’s console and see these errors even during development. The Apollo Server has a configuration option called formatError that can be used to make changes to the way the error is sent back to the caller. We can use this option to print out the error on the console as well:

```js
...
formatError: error => {
    console.log(error);
    return error;
}
...
```

All the changes in server.js for adding programmatic validations and proper validation of GraphQLDate type are shown

<pre>
...
const { ApolloServer, UserInputError } = require('apollo-server-exress');
...
const GraphQLDate = new GraphQLScalarType({
    ...
    parseValue(value) {
        <del>return new Date(value);</del>
        <b>const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;</b>
    },
    parseLiteral(ast) {
        <del>return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;</del>
        <b>if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;</b>
        }
    }
});
...
function issueValidate(issue) {
    <b>const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "owner" is required when statusis "Assigned"');
    }
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.ength > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}</b>

function issueAdd(_, { issue }) {
    <b>issueValide(issue);</b>
    issue.created = new Date();
    issue.id = issueDB.length + 1;
    <del>if (issue.status == undefined) issue.status = 'New';</del>
    issueDB.push(issue);
    return issue;
}

const server = new ApolloServer ({
    typeDefs: fs.readFileSync('./server/sceham.graphql', 'utf-8'),
    resolvers,
    <b>formatErrors: error => {
        console.log(error);
        return error;
    },</b>
});
</pre>

Testing these changes using the application is going to be hard, requiring temporary code changes, so
you can use the Playground to test the validations. Note that since status is now an enum, the value should be supplied as a literal, i.e., without quotes in the Playground. A valid call to issueAdd will look like this:

```js
mutation {
  issueAdd(
    issue: {
      title: "Completion date should be optional"
      status: New,
    }
  ) {
    id
    status
  }
}
```

<hr>
On running this code, Playground results should show the following new issue added:

```json
{
  "data": {
    "issueAdd": {
      "id": 3,
      "status": "New"
    }
  }
}
```

<hr>
If you change the status to an invalid enum like Unknown, you should get back an error like this:

```js
{
  "error": {
    "errors": [
      {
        "message": "Expected type StatusType, found Unknown.",
```

<hr>
If you use a string "New" instead, it should show a helpful error message like this:

```js
{
  "error": {
    "errors": [
      {
        "message": "Expected type StatusType, found \"New\"; Did you mean the enum value New?",
```

<hr>
Finally, if you remove the status altogether, you will find that it does default the value to New as seen in the result window.
For testing the programmatic validations, you can try to create an issue where both checks will fail. The
following query should help with that:

```js
mutation {
  issueAdd(
    issue: {
      title: "Co",
      status: Assigned,
    }
  ) {
    id
    status
  }
}
```
On running this query, the following error will be returned, where both the messages are listed under
the exception section.

```js
"extensions": {
  "errors": [
    "Field \"Title\" must be at least 3 characters long",
    "Field \"owner\" is required when status is \"Assigned\""
```

<hr>

To test the date validations, you need to test both using literals and query variables. For the literal test, you can use the following query:

```
mutation {
  issueAdd(
    issue: {
      title: "Completion data should be optional",
      due: "not-a-date",
    }
  ) {
    id
  }
}
```

The following error will be returned:

```js
"errors": [
  {
    "message": "Expected type GraphQLDate, found \"not-a-date\".",
```

<hr>
As for the query variable based test, here’s the query that can be used:

```js
mutation issueAddOperation($issue: IssueInputs!) {
  issueAdd(issue: $issue) {
    id
    status
    due
  }
}
```

And this is the query variables:

`{"issue":{"title":"test", "due":"not-a-date"}}`

