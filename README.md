# Reading from MongoDB

In the previous section, you saw how to use the Node.js driver to perform basic CRUD tasks. Let’s now change the List API to read from the MongoDB database rather than the in-memory array of issues in the server. Since we’ve initialized the database with the same initial set of issues, while testing, you should see the same set of issues in the UI.

In the trial that we did for the driver, we used the connection to the database in a sequence of operations and closed it. In the application, instead, we will maintain the connection so that we can reuse it for many operations, which will be triggered from within API calls. So, we’ll need to store the connection to the database in a global variable. Let’s do that in addition to the import statement and other global variable declarations and call the global database connection variable db:

```js
...
const url = 'mongodb://localhost/issuetracker';

// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

let db;
...
```

Next, let’s write a function to connect to the database, which initializes this global variable. This is a minor variation of what we did in trymongo.js. Let’s not catch any errors in this function, instead, let the caller deal with them.

```js
...
async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}
...
```

Now, we have to change the setup of the server to first connect to the database and then start the Express application. Since connectToDb() is an async function, we can use await to wait for it to finish, then call app.listen(). But since await cannot be used in the main section of the program, we have to enclose it within an async function and execute that function immediately.

```js
...
(async function() {
  await connectToDb();
  app-listen(3000, function() {
    console.log('App started on port 3000');
  });
})();
...
```

But we also have to deal with errors. So, let’s enclose the contents of this anonymous function within a try block and print any errors on the console in the catch block:

```js
...
(async function() {
  try {
    ...
  } catch (err) {
    console.log('Error:', err);
  }
})();
...
```

Now that we have a connection to the database set up in the global variable called db, we can use it in the List API resolver issueList() to retrieve a list of issues by calling the find() method on the issues collection. We need to return an array of issues from this function, so let’s just use toArray() function on the results of find() like this:

```js
...
  const issues = await db.collection('issues').find({}).toArray();
...
```

The changes to **server.js** are shown in

<pre>
...
const { Kind } = require('graphql/language');
<b>const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';</b>
// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';
// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';
<b>let db;</b>

let aboutMessage = "Issue Tracker API v1.0";
...
<b>async</b> function issueList() {
  <del>return issuesDB;</del>
  <b>const issues = db.collection('issues').find({}).toArray();
  return issues;</b>
}
...
<b>async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}</b>

const server = new ApolloServer({
  ...
  <b>(async function() {
    try{
      await connectToDb();</b>
      app.listen(3000, function() {
        console.log('App started on port 3000');
      });<b>
    } catch(err) {
      console.log('ERROR:', err);
    }
  })();</b>
})
</pre>

 > We did not have to do anything special due to the fact that the resolver issueList() is now an async function, which does not immediately return a value. The graphql-tools library handles this automatically. A resolver can return a value immediately or return a Promise (which is what an async function returns immediately). Both are acceptable return values for a resolver.

Since the issues from the database now contain an _id in addition to the id field, let’s include that in the GraphQL schema of the type Issue. Otherwise, clients who call the API will not be able to access this field. Let’s use ID as its GraphQL data type and make it mandatory. This change is shown:

<pre>
...
type Issue {
  <b>_id: ID!</b>
  id: Int!
  ...
}
...
</pre>

if you refresh the browser, you will find that the two initial sets of issues are listed in a table, as before. The UI itself will show no change, but to convince yourself that the data is indeed coming from the database, you could modify the documents in the collection using the mongo shell and the updateMany()method on the collection. If, for example, you update effort to 100 for all the documents and refresh the browser, you should see that the effort is indeed showing 100 for all the rows in the table.
