# MongoDB CRUD Operations

Let’s explore the CRUD operations available in MongoDB using the shell. We will continue to use the issuetracker database we created in the previous section. But let’s clear the database so that we can start fresh.

` > db.employees.drop() `

This should result in an output like this:
<hr>
true
<hr>

This is different from removing all the documents in the collection, because it also removes any indexes that are part of the collection.

### Create

In the previous section, you briefly saw how to insert a document, and as part of that, you found how MongoDB automatically created the primary key, which was a special data type called ObjectID. Let’s now use our own ID instead of letting MongoDB auto-generate one.

` > db.employees.insertOne({ id: 1, name: { first: 'John', last: 'Doe' }, age: 43 }) `

This will result in the following output:
<hr>
{ acknowledged: true, insertedId: 1 }
<hr>

Note that the value of insertedId reflected the value that we supplied for `_id`. Which means that, instead of an ObjectID type of value, we were able to supply our own value. Let’s try to create a new identical document (you can use the Up Arrow key to repeat the previous command in the mongo shell). It will fail with the following error:

`  E11000 duplicate key error collection: issuetracker.employees index: _id_ dup key: { _id: 1 } `

 Now, let’s add another document, but with a new field as part of the name, say, the middle name:
 
 ` > db.employees.insertOne({name: {first: 'John', middle: 'H', last: 'Doe'}, age: 24 }) `
 
 This works just fine, and using find(), you can see that two documents exist in the collection, but they are not necessarily the same schema. This is the advantage of a flexible schema: the schema can be enhanced whenever a new data element that needs to be stored is discovered, without having to explicitly modify the schema.
In this case, it is implicit that any employee document where the middle field under name is missing indicates an employee without a middle name. If, on the other hand, a field was added that didn’t have an implicit meaning when absent, its absence would have to be handled in the code. Or a migration script would have to be run that defaults the field’s value to something.

In most cases, leaving the creation of the primary key to MongoDB works just great, because you don’t have to worry about keeping it unique: MongoDB does that automatically. But, this identifier is not humanreadable. In the Issue Tracker application, we want the identifier to be a number so that it can be easily remembered and talked about. But instead of using the `_id` field to store the human-readable identifier, let’s use a new field called id and let MongoDB auto-generate `_id`.
So, let’s drop the collection and start creating new documents with a new field called id

```js
 > db.employees.drop()
 > db.employees.insertOne({_id: 1, name: {first: 'John', last: 'Doe' }, age: 44 })
 > db.employees.insertOne({_id: 2, name: {first: 'Jane', last: 'Doe' }, age: 16 })
```

The collection has a method that can take in multiple documents in one go. This method is called insertMany(). Let’s use that to create a few more documents in a single command:

```js
 > db.employees.insertMany([
 { _id: 3, name: { first: 'Alice', last: 'A' }, age: 32 },
 { _id: 4, name: { first: 'Bob', last: 'B' }, age: 64 }
])
  
```

The response to this would have shown that multiple insertedIds that were created as opposed to a single insertedId for the insertOne() method, like this:
<hr>
{ acknowledged: true, insertedIds: { '0': 3, '1': 4 } }
<hr>
