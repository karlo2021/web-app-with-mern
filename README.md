# MongoDB

Until now, we had an array of issues in the Express server’s memory that we used as the database. We’ll replace this with real persistence and read and write the list of issues from a MongoDB database.
To achieve this, we’ll need to install or use MongoDB on the cloud, get used to its shell commands, install a Node.js driver to access it from Node.js, and finally modify the server code to replace the API calls to read and write from a MongoDB database instead of the in-memory array of issues.

## MongoDB Basics

This is an introductory section, where we will not be modifying the application. We’ll look at these core concepts in this section: MongoDB, documents, and collections. Then, we’ll set up MongoDB and explore these concepts with examples using the mongo shell to read and write to the database.

### Documents

MongoDB is a document database, which means that the equivalent of a record is a document, or an object. In a relational database, you organize data in terms of rows and columns, whereas in a document database, an entire object can be written as a document. A document is a data structure composed of field and value pairs. The values of fields may include objects, arrays, and arrays of objects and so on, as deeply nested as you want it to be. MongoDB documents are similar to JSON objects, so it is easy to think of them as JavaScript objects. Compared to a JSON object, a MongoDB document has support not only for the primitive data types—Boolean, numbers, and strings—but
also other common data types such as dates, timestamps, regular expressions, and binary data. An Invoice object may look like this:

```js
{
 "invoiceNumber" : 1234,
 "invoiceDate" : ISODate("2018-10-12T05:17:15.737Z"),
 "billingAddress" : {
  "name" : "Acme Inc.",
  "line1" : "106 High Street",
  "city" : "New York City",
  "zip" : "110001-1234"
 },
 "items" : [
  {
    "description" : "Compact Flourescent Lamp",
    "quantity" : 4,
    "price" : 12.48
  },
  {
    "description" : "Whiteboard",
    "quantity" : 1,
    "price" : 5.44
  }
 ]
}
```

### Collections

A collection is like a table in a relational database: it is a set of documents. Just like in a relational database, the collection can have a primary key and indexes. But there are a few differences compared to a relational database.
A primary key is mandated in MongoDB, and it has the reserved field name `_id`. Even if `_id` field is not supplied when creating a document, MongoDB creates this field and auto-generates a unique key for every document. More often than not, the auto-generated ID can be used as is, since it is convenient and guaranteed to produce unique keys even when multiple clients are writing to the database simultaneously. MongoDB uses a special data type called the ObjectId for the primary key.
The `_id` field is automatically indexed. Apart from this, indexes can be created on other fields, and this includes fields within embedded documents and array fields. Indexes are used to efficiently access a subset of documents in a collection
Unlike a relational database, MongoDB does not require you to define a schema for a collection. The only requirement is that all documents in a collection must have a unique `_id`, but the actual documents may have completely different fields. In practice, though, all documents in a collection do have the same fields. Although a flexible schema may seem very convenient for schema changes during the initial stages of an application, this can cause problems if some kind of schema checking is not added in the application code.
As of version 3.6, MongoDB has supported a concept of schema, even though it is optional. You can read all about MongoDB schemas at https://docs.mongodb.com/manual/core/schema-validation/ index.html. A schema can enforce allowed and required fields and their data types, just like GraphQL can.
But it can also validate other things like string length and minimum and maximum values for integers. But the errors generated because of schema violations do not give enough details as to which of the validation checks fail as of version 3.6. This may improve in future versions of MongoDB, at which point in time it is worth considering adding full-fledged schema checks. For the Issue Tracker application, we’ll not use the schema validation feature of MongoDB, instead, we’ll implement all necessary validations in the back-end code.

### Query Language

Unlike the universal English-like SQL in a relational database, the MongoDB query language is made up of methods to achieve various operations. The main methods for read and write operations are the CRUD methods. 
All methods operate on a collection and take parameters as JavaScript objects that specify the details of the operation. Each method has its own specification. For example, to insert a document, the only argument needed is the document itself. For querying, the parameters are a query filter and a list of fields to return
(also called the projection). For example, to match all documents with the field invoiceNumber that are greater than 1,000, the following query filter can be used:

` { "invoiceNumber": { $gt: 1000 } } `

Unlike relational databases, MongoDB encourages denormalization, that is, storing related parts of a document as embedded subdocuments rather than as separate collections (tables) in a relational database. Take an example of people (name, gender, etc.) and their contact information (primary address, secondary
address etc.). In a relational database, this would require separate tables for People and Contacts, and then a join on the two tables when all of the information is needed together. In MongoDB, on the other hand, it can be stored as a list of contacts within the same People document.

### Installation

Before you try to install MongoDB on your computer, you may want to try out one of the hosted services that give you access to MongoDB. There are many services, but the following are popular and have a free version that you can use for a small test or sandbox application. Any of these will do quite well for the purpose of the
Issue Tracker application that we’ll build as part of this book.

 > MongoDB Atlas (https://www.mongodb.com/cloud/atlas):  A small database (shared RAM, 512 MB storage) is available for free.
 
 > mLab (previously MongoLab) (https://mlab.com/): mLab has announced an acquisition by MongoDB Inc. and may eventually be merged into Atlas itself. A sandbox environment is available for free, limited to 500 MB storage.
 
 > Compose (https://www.compose.com): Among many other services, Compose offers MongoDB as a service. A 30-day trial period is available, but a permanently free
sandbox kind of option is not available.

Of these three, I find Atlas the most convenient because there are many options for the location of the host. When connecting to the database, it lets me choose one closest to my location, and that minimizes the latency. mLab does not give a cluster—a database can be created individually. Compose is not permanently
free.
The downside of any of the hosted options is that, apart from the small extra latency when accessing the database, you need an Internet connection. Which means that you may not be able to test your code where Internet access is not available, for example, on a flight. In comparison, installing MongoDB on your computer may work better, but the installation takes a bit more work than signing up for one of the cloudbased options. Even when using one of the cloud options, you will need to download and install the mongo shell to be able to access the database remotely.
If you choose to install MongoDB on your computer (it can be installed easily on OS X, Windows, and most distributions based on Linux), look up the installation instructions, which are different for each operating system. You may install MongoDB by following the instructions at the MongoDB website
(https://docs.mongodb.com/manual/installation/ or search for “mongodb installation” in your search engine). Most local installation options let you install the server, the shell, and tools all in one. Check that this is the case; if not, you may have to install them separately.
After a local installation, ensure that you have started MongoDB server (the name of the daemon or service is mongod), if it is not already started by the installation process. Test the installation by running the mongo shell like this:

`$mongo `

On a Windows system, you may need to append .exe to the command. The command may require a path depending on your installation method. If the shell starts successfully, it will also connect to the local MongoDB server instance. You should see the version of MongoDB printed on the console, the database it is
connecting to (the default is test), and a command prompt, like this, if you had installed MongoDB version 4.0.2 locally:
<hr>
MongoDB shell version v4.0.2<br />
connecting to: mongodb://127.0.0.1:27017<br />
MongoDB server version: 4.0.2<br />
>
<hr>
You do need to see the prompt > where you can type further commands. If, instead, you see an error message, revisit the installation and the server starting procedure.

### The Mongo Shell

The mongo shell is an interactive JavaScript shell, very much like the Node.js shell. In this section, we’ll discuss the basic operations that are possible via the shell, those that are most commonly used. For a full reference of all the capabilities of the shell, you can take a look at the mongo shell documentation at
https://docs.mongodb.com/manual/mongo/.

To work with MongoDB, you need to connect to a database. Let’s start with finding which databases are available. The command to show the current databases is:
` > show databases `

This will list the databases and the storage occupied by them. For example, in a fresh local installation of MongoDB, this is what you will see:
<hr>
admin   377 kB<br/>
local  9.44 GB<br/>
<hr>
These are system databases that MongoDB uses for its internal book keeping, etc. We will not be using any of these to create our collections, so we’d better change the current database. To identify the current database, the command is:
` > db `

The default database a mongo shell connects to is called test and that is what you are likely to see as the output to this command. Let’s now see what collections exist in this database.
` > show collections `

You will find that there are no collections in this database, since it is a fresh installation. Further, you will also find that the database test was not listed when we listed the available databases. That’s because databases and collections are really created only on the first write operation to any of these. Let’s switch to a database called issuetracker instead of using the default database:
` > use issuetracker `

This should result in output that confirms that the new database is issuetracker:
<hr>
switched to db issuetracker
<hr>

Let’s confirm that there are no collections in this database either:
` > show collections `

This command should return nothing. Now, let’s create a new collection. This is done by creating one document in a collection. A collection is referenced as a property of the global object db, with the same name as the collection. The collection called employees can be referred to as db.employees. Let’s insert a new document in the employees collection using the insertOne() method. This method takes in the document to be inserted as an argument:

` > db.employeesinserOne({ name: { firstName: 'John', lastName: 'Doe' }, age: 44 }) `

The result of this command will show you the result of the operation and the ID of the new document that was created, something like this:
<hr>
{<br/>
&nbsp;&nbsp;  acknowledged: true,<br/>
&nbsp;&nbsp;  insertedId: ObjectId("625d309b3860256806deb1bb")<br/>
}
<hr>

Apart from the insertOne() method, many methods are available on any collection. You can see the list of available methods by pressing the Tab character twice after typing "db.employees." (the period at the end is required before pressing Tab). You may find an output like the following:
<hr>
db.employees.constructor<br/>
db.employees.isPrototypeOf<br/>
db.employees.toStringf<br/>
db.employees.bulkWrite<br/>
db.employees.deleteOne<br/>
db.employees.find<br/>
db.employees.findOneAndDelete<br/>
db.employees.insertMany<br/>
db.employees.replaceOne<br/>
db.employees.convertToCapped<br/>
db.employees.ensureIndex<br/>
db.employees.getIndices<br/>
db.employees.dropIndex<br/>
db.employees.getMongo<br/>
...
<hr>

This is the auto-completion feature of the mongo shell at work. Note that you can let the mongo shell auto-complete the name of any method by pressing the Tab character after entering the beginning few characters of the method.
Let’s now check if the document has been created in the collection. To do that, we can use the find() method on the collection. Without any arguments, this method just lists all the documents in the collection:

` > db.employees.find() `

This should result in displaying the document we just created, but it is not "pretty" formatted. It will be printed all in one line and may wrap around to the next line inconveniently. To get a more legible output, we can use the pretty() method on the result of the find() method:

` > db.employees.find().pretty() `

That should show a much more legible output, like this:

```js
[
  {
    _id: ObjectId("625d309b3860256806deb1bb"),
    name: { first: 'John', last: 'Doe' },
    age: 44
  }
]
```
