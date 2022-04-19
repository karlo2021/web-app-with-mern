# MongoDB CRUD Operations

This is the Node.js driver that lets you connect and interact with the MongoDB server. It provides methods very similar to what you saw in the mongo shell, but not exactly the same. Instead of the low-level MongoDB driver, we could use an Object Document Mapper called Mongoose, which has a higher level of abstraction and more convenient methods. But learning about the lower-level MongoDB driver may give you a better handle on the actual working of MongoDB itself, so I’ve chosen to use the low-level driver for the Issue Tracker application. To start, let’s install the driver:

` > npm install mongodb@3 `

In the next section, we’ll use some code from this trial to integrate the driver into the Issue Tracker application. Let’s call this sample Node.js program trymongo.js and place it in a new directory called scripts, to distinguish it from other files that are part of the application.

The first thing to do is make a connection to the database server. This can be done by first importing the object MongoClient from the driver, then creating a new client object from it using a URL that identifies a database to connect to, and finally calling the connect method on it, like this:

```js
... 
const { MongoClient } = require('mongodb');
const client = new MongoClient(url);

client.connect();
...
```

The URL should start with mongodb:// followed by the hostname or the IP address of the server to connect to. An optional port can be added using : as the separator, but it’s not required if the MongoDB server is running on the default port, 27017. It’s good practice to separate the connection parameters into a configuration file rather than keep them in a checked-in file, but we’ll do this in the next chapter. 
If you have used one of the cloud providers, the URL can be obtained from the corresponding connection instructions. For the local installation, the URL will be mongodb://localhost/issuetracker. Note that the MongoDB Node.js driver accepts the database name as part of the URL itself, and it is best to specify it this way, even though a cloud provider may not show this explicitly. Let’s add the local installation URL to trymongo.js and a commented version of cloud providers’ URLs.

```js
...
const url = 'mongodb://localhost/issuetracker';
// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';
...
```

Further, the client constructor takes in another argument with more settings for the client, one of which is whether to use the new style parser. Let’s change the constructor to pass this also, to avoid a warning in the latest Node.js driver

<pre>
...
const client = new MongoClient(url, <b>{ useNewUrlParser: true }</b>);
...
</pre>


The connect() method is an asynchronous method and needs a callback to receive the result of the connection. The callback takes in two arguments: an error and the result. The result is the client object itself. Within the callback, a connection to the database (as opposed a connection to the server) can be obtained by calling the db method of the client object. Thus, the callback and connection to the database can be written like this:

```js
...
client.connect(function(err, client) {
 const db = client.db();
 ...
```

The connection to the database, db, is similar to the db variable we used in the mongo shell. In particular, it is the one that we can use to get a handle to a collection and its methods. Let’s get a handle to the collection called employees that we were using in the previous section using the mongo shell.

```js
...
const collection = db.collection('employees');
```
