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



