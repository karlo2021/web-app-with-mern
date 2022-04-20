# Schema Initialization

The mongo shell is not only an interactive shell, but is also a scripting environment. Using this, scripts can be written to perform various tasks such as schema initialization and migration. Because the mongo shell is in fact built on top of a JavaScript engine, the power of JavaScript is available in the scripts, just as in the shell itself.
One difference between the interactive and the non-interactive mode of working is that the noninteractive shell does not support non-JavaScript shortcuts, such as use $db and show collections
commands.
Let’s create a schema initialization script called init.mongo.js within the script directory. Since
MongoDB does not enforce a schema, there is really no such thing as a schema initialization as you may do
in relational databases, like creation of tables. The only thing that is really useful is the creation of indexes, which are one-time tasks.
We will use the same database called issuetracker that we used to try out the mongo shell, to
store all the collections relevant to the Issue Tracker application.
Let’s copy the array of issues from server.js and use the same array to initialize the collection using
insertMany() on a collection called issues. But before that, let’s clear existing issues it by calling a remove() with an empty filter (which will match all documents) on the same collection.
Complete contents of the initialization script, init.mongo.js is shown:

```js
/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 * mongo issuetracker scripts/init.mongo.js
 * Atlas:
 * mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 * mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.issues.remove({});

const issuesDB = [
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
];

db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });
```

You should be able to run this script using the mongo shell, with the name of the file as an argument in
the command line, if you are using the local installation of MongoDB like this:

`$ mongo issuetracker scripts/init.mongo.js `

For the other methods of using MongoDB, there are instructions as comments on the top of the script.
In essence, the entire connection string has to be specified in the command line, including the username
and password that you use to connect to the hosted service. Following the connection string, you can type
the name of the script, scripts/init.mongo.js.
You can run this any time you wish to reset the database to its pristine state. You should see an output that indicates that two issues were inserted, among other things such as the MongoDB version and the shell version. Note that creating an index when one already exists has no effect, so it is safe to create the index multiple times.