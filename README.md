# List Api

The next thing we’ll do is implement an API to fetch a list of issues. We’ll test it using the layground and, in the next section, we’ll change the front-end to integrate with this new API.

Let’s start by modifying the schema to define a custom type called Issue. It should contain all the fields of the issue object that we have been using up to now. But since there is no scalar type to denote a date in GraphQL, let’s use a string type for the time being.

```js
...
type Issue {
  id: Int!
  ...
  due: String!
}
...
```

Now, let’s add a new field under Query to return a list of issues. The GraphQL way to specify a list of
another type is to enclose it within square brackets. We could use [Issue] as the type for the field, which we will call issueList. But we need to say not only that the return value is mandatory, but also that each element in the list cannot be null. So, we have to add the exclamation mark after Issue as well as after the array type, as in [Issue!]!.

Let’s also separate the top-level Query and Mutation definitions from the custom types using a comment. The way to add comments in the schema is using the # character at the beginning of a line.

<pre>
<b>type Issue {
  id: Int!
  title: String!
  status: String!
  owner: String
  effort: Int
  created: String!
  due: String
}

##### Top level declaration
</b>
type Query {
  about: String!
  <b>IssueList: [issue!]!</b>
}
type Mutation {
  setAboutMessage(message: String!): String
}
</pre>

In the server code, we need to add a resolver under Query for the new field, which points to a function.
We’ll also have an array of issues (a copy of what we have in the front-end code) that is a stand-in for a database. Let’s create a separate function called issueList.

<pre>
let aboutMessage = "Issue Tracker API v1.0";

<b>const issuesDB = [
  {
    id: 1, status: 'New', owner: 'Ravan', effort: 5,
    created: new Date('2019-01-15'), due: undefined,
    title: 'Error in console when clicking Add',
  },
  {
    id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
    created: new Date('2019-01-16'), due: new Date('2019-02-01'),
    title: 'Missing bottom border on panel',
  },
];</b>

cosnt resolver = {
  Query: {
    about: () => aboutMessage,
    <b>issueList</b>
  }
  Mutation {
    setAboutMessage,
  },
};
function setAboutMessage(_, {message}) {
  return aboutMessage = message;
}
<b>funciton issueList() {
  return issueDB;
}</b>
...
</pre>

To test this in the Playground, you will need to run a query that specifies the issueList field, with
subfields. The array itself need not be expanded in the query. It is implicit (due to the schema specification) that issueList returns an array, and therefore, subfields of the field are automatically expanded within the array. Here is one such query that you can run to test the issueList field:

```js
query {
  issueList {
    id
    title
    created
  }
}
```

This query will result in an output like this

```json
{
  "data": {
    "issueList": [
      {
        "id": 1,
        "title": "Error in console when clicking Add",
        "created": "Tue Jan 15 2019 01:00:00 GMT+0100 (Central European Standard Time)"
      },
      {
        "id": 2,
        "title": "Missing bottom border on panel",
        "created": "Wed Jan 16 2019 01:00:00 GMT+0100 (Central European Standard Time)"
      }
    ]
  }
}
```

If you add more subfields in the query, their values will also be returned. If you look at the date fields, you will see that they have been converted from a Date object to a string using the toString() method of the Date JavaScript object.