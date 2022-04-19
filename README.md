# MongoDB Node.js Driver

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
...
```

With this collection, we can do the same things we did with the mongo shell’s equivalent db.employees in the previous section. The methods are also very similar, except that they are all asynchronous. This means that the methods take in the regular arguments, but also a callback function that’s called when the operation completes. The convention in the callback functions is to pass the error as the first argument and the result of the operation as the second argument. 
Let’s insert a document and read it back to see how these methods work within the Node.js driver. The insertion can be written using the insertOne method, passing in an employee document and a callback. Within the callback, let’s print the new `_id` that was created. Just as in the mongo shell insertOne command,
the created ID is returned as part of the result object, in the property called insertedId.

```js
...
const employee = { id: 1, name: 'A.Callback', age: 23 };
collecton.insertOne(employee, function(err, result) {
 console.log('Result of insert:\n', result.insertedId);
```

Note that accessing the collection and the insert operation can only be called within the callback of the connection operation, because only then do we know that the connection has succeeded. There also needs to be some amount of error handling, but let’s deal with this a little later. Now, within the callback of the insert operation, let’s read back the inserted document, using the ID of the result. We could use either the ID we supplied (id) or the auto-generated MongoDB ID `_id`. Let’s use `_id` just to make sure that we are able to use the result values.

```js
...
collection.find({ _id: result.insertedId })
 .toArray(function(err, docs) {
   console.log('Result of find:\n', docs);
 }
...
```

Now that we are done inserting and reading back the document, we can close the connection to the server. If we don’t do this, the Node.js program will not exit, because the connection object is waiting to be used and listening to a socket.

```js
...
 client.close();
...
```

Let’s put all this together in a function called testWithCallbacks(). We will soon also use a different method of using the Node.js driver using async/await. Also, as is customary, let’s pass a callback function to this function, which we will call from the testWithCallbacks() function once all the operations are
completed. Then, if there are any errors, these can be passed to the callback function. Let’s first declare this function:

```js
...
function testWithCallbacks(callback) {
	console.log('\n--- testWithCallbacks ---');
	...
}
...
```

And within each callback as a result of each of the operations, on an error, we need to do the following:
•	 Close the connection to the server<br />
•	 Call the callback<br />
•	 Return from the call, so that no more operations are performed<br />

We also need to do the same when all operations are completed. The pattern of the error handling is like this:

```js
...
if (err) {
	client.close();
	callback(err);
	return;
}
...
```

Let’s also introduce a call to the testWithCallbacks() function from the main section, supply it a callback to receive any error, and print it if any

```js
...
testWithCallback(function(err) {
	if (err) {
		console.log(err);
}
...
```

With all the error handling and callbacks introduced, the final code in the trymongo.js file is shown:

```js
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';

// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

function testWithCallbacks(callback) {
	console.log('\n--- testWithCallbacks ---');
	const client = new MongoClient(url, { useNewUrlParser: true });
	client.connect(function(err, client) {
		if (err) {
			callback(err);
			return;
		}
		console.log('Connected to db');
		
		const db = client.db();
		const collection = db.collection('employees');
		
		const employee = { id: 1, name: 'A. Callback', age: 23 };
		collection.insertOne(employee, function(err, result) {
			if (err) {
				client.close();
				callback(err);
				return;
			}
			console.log('Result of insert:\n', result.insertedId);
			collection.find({ _id: result.insertedId })
				.toArray(function(err, docs) {
				if (err) {
					client.close();
					callback(err);
					return;
				}
				console.log('Result of find:\n', docs);
				client.close();
				callback(err);
			});
		});
	});
}
	
testWithCallbacks(function(err) {
	if (err) {
		console.log(err);
	}
});
```

Let’s clean up the collection before we test this. We could open another command shell, run the mongo shell in it, and execute db.employees.remove({}). But the mongo shell has a command line way of executing a simple command using the --eval command line option. Let’s do that instead and pass the database name to connect to; otherwise, the command will be executed on the default database test. For the local installation, the command will look like this:

`$ mongo issuetracker --eval "db.employees.remove({})" `

If you are using a remote server from one of the hosting providers, instead of the database name, use the connection string including the database name as suggested by the hosting provider. For example, the Atlas command may look like this (replace the hostname, user, and password with your own):

` $ mongo "mongodb+srv://cluster0-xxxxx.mongodb.net/issuetracker" --username atlasUser --password atlasPassword --eval "db.employees.remove({})"`

Now, we are ready to test the trial program we just created. It can be executed like this:

`$ node scripts/trymongo.js `

This should result in output like this (you will see a different ObjectID, otherwise the output should be the same):

```js
Connected to db
Result of insert:
 625ed80ba56e5a034c2adb91
Result of find:
 [
  {
    _id: 625ed80ba56e5a034c2adb91,
    id: 1,
    name: 'A. Callback',
    age: 23
  }
]
```