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

