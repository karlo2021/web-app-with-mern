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
 > db.employees.insertOne({ id: 1, name: {first: 'John', last: 'Doe' }, age: 44 })
 > db.employees.insertOne({ id: 2, name: {first: 'Jane', last: 'Doe' }, age: 16 })
```

The collection has a method that can take in multiple documents in one go. This method is called insertMany(). Let’s use that to create a few more documents in a single command:

```js
 > db.employees.insertMany([
 { id: 3, name: { first: 'Alice', last: 'A' }, age: 32 },
 { id: 4, name: { first: 'Bob', last: 'B' }, age: 64 }
])
  
```

The response to this would have shown that multiple insertedIds that were created as opposed to a single insertedId for the insertOne() method, like this:

```js
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId("625dcda37185ea0a7845e9df"),
    '1': ObjectId("625dcda37185ea0a7845e9e0")
  }
}
```

### Read

Now that there are multiple documents in the collection, let’s see how to retrieve a subset of the documents as opposed to the full list. The find() method takes in two more arguments. The first is a filter to apply to the list, and the second is a projection, a specification of which fields to retrieve.

Now that there are multiple documents in the collection, let’s see how to retrieve a subset of the documents as opposed to the full list. The find() method takes in two more arguments. The first is a filter to apply to the list, and the second is a projection, a specification of which fields to retrieve.

` > db.employees.findOne({ id: 1 }) `

This should return the first employee document that we created, and the output will look like this:

```js
{
  _id: ObjectId("625dcd887185ea0a7845e9dd"),
  id: 1,
  name: { first: 'John', last: 'Doe' },
  age: 44
}
```

Note that we did not use pretty() here, yet, the output is prettified. This is because findOne() returns a single object and the mongo shell prettifies objects by default.
The filter is actually a shorthand for { id: { $eq: 1 } }, where $eq is the operator signifying that the value of the field id has to be equal to 1. In the generic sense, the format of a single element in the filter is fieldname: { operator: value }. Other operators for comparison are available, such as $gt for greater than, etc. Let’s try the $gte (greater than or equal to) operator for fetching a list of employees aged 30 or older:

` > db.employees.find({ age: { $gte: 30 } })`

That command should return three documents, because we inserted those many whose age was more than 30. If multiple fields are specified, then all of them have to match, which is the same as combining them with an and operator:

` > db.employees.find({ age: { $gte: 30 }, 'name.last': 'Doe' }) `

The number of documents returned now should be reduced to only one, since there is only one document that matched both the criteria, the last name being equal to 'Doe' as well as age being greater than 30. Note that we used the dot notation for specifying a field embedded in a nested document. And this also made us use quotes around the field name, since it is a regular JavaScript object property.
To match multiple values of the same field—for example, to match age being greater than 30 and age being less than 60—the same strategy cannot be used. That’s because the filter is a regular JavaScript object, and two properties of the same name cannot exist in a document. Thus, a filter like { age: { $gte: 30 },age: { $lte: 60 } } will not work. An explicit $and operator has to be used, which takes in an array of objects specifying multiple field-value criteria. You can read all about the $and operator and many more operators in the operators section of the reference manual of MongoDB at https://docs.mongodb.com/manual/reference/operator/query/.

When filtering on a field is a common occurrence, it’s typically a good idea to create an index on that field. The createIndex() method on the collection is meant for this purpose. It takes in an argument specifying the fields that form the index (multiple fields will form a composite index). Let’s create an index on the age field:

` > db.employees.createIndex({ age:1 }) `

With this index, any query that uses a filter that has the field age in it will be significantly faster because MongoDB will use this index instead of scanning through all documents in the collection. But this was not a unique index, as many people can be the same age.
The age field is probably not a frequently used filter, but fetching a document based on its identifier is going to be very frequent. MongoDB automatically creates an index on the `_id` field, but we have used ourown identifier called id, and this field is what is more likely to be used to fetch individual employees. So let’s create an index on this field. Further, it has to be unique since it identifies the employee: no two employees should have the same value for id. The second argument to createIndex() is an object that contains various attributes of the index, one of them specifying whether the index is unique. Let’s use that to create a unique
index on id:

` > db.employees.createIndex({id: 1}, {unique: true}) `

Now, not only will the find() method perform much better when a filter with id is supplied, but creation of a document with a duplicate id will be prevented by MongoDB. Let’s try that by re-running the insert command for the first employee:

` > db.employees.insertOne({id: 1, name: {first: 'John', last: 'Doe'}, age: 44 }) `

Now, you should see an error in the mongo shell like this
<hr>
E11000 duplicate key error collection: issuetracker.employees index: id_1 dup key: { id: 1 }
<hr>

### Projection

All this while, we retrieved the entire document that matched the filter. In the previous section, when we had to print only a subset of the fields of the document, we did it using a forEach() loop. But this means that the entire document is fetched from the server even when we needed only some parts of it for printing. When the documents are large, this can use up a lot of network bandwidth. To restrict the fetch to only some fields, the find() method takes a second argument called the projection. A projection specifies which fields to include or exclude in the result.
The format of this specification is an object with one or more field names as the key and the value as 0 or 1, to indicate exclusion or inclusion. But 0s and 1s cannot be combined. You can either start with nothing and include fields using 1s, or start with everything and exclude fields using 0s. The `_id` field is an exception;
it is always included unless you specify a 0. The following will fetch all employees but only their first names and age:

` > db.employees.find({}, {'name.first':1, age: 1}) `

Note that we specified an empty filter, to say that all documents have to be fetched. This had to be done since the projection is the second argument. The previous request would have printed something like this:

```js
[
  {
    _id: ObjectId("625dcd887185ea0a7845e9dd"),
    name: { first: 'John' },
    age: 44
  },
  {
    _id: ObjectId("625dcd937185ea0a7845e9de"),
    name: { first: 'Jane' },
    age: 16
  },
  {
    _id: ObjectId("625dcda37185ea0a7845e9df"),
    name: { first: 'Alice' },
    age: 32
  },
  {
    _id: ObjectId("625dcda37185ea0a7845e9e0"),
    name: { first: 'Bob' },
    age: 64
  }
]
```

Even though we specified only the first name and age, the field `_id` was automatically included. To suppress the inclusion of this field, it needs to be explicitly excluded, like this:

` > db.employees.find({},{_id:0 ,'name.first': 1, age: 1 }) `

### Update

There are two methods—updateOne() and updateMany()—available for modifying a document. The arguments to both methods are the same, except that updateOne() stops after finding and updating the first matching document. The first argument is a query filter, the same as the filter that find() takes. The second argument is an update specification if only some fields of the object need to be changed.
When using updateOne(), the primary key or any unique identifier is what is normally used in the filter, because the filter can match only one document. The update specification is an object with a series of $set properties whose values indicate another object, which specifies the field and its new value. Let’s update the age of the employee identified by the id 2:

` > db.employees.updateOne({ id: 2 }, { $set: { age: 23 } }) `

This should result in the following output:
<hr>
{ 
  acknowledged: true, 
  insertedId: null, 
  matchedCount: 1, 
  modifiedCount: 1, 
  upsertedCount: 0 
}
<hr>

The matchedCount returned how many documents matched the filter. If the filter had matched more than one, that number would have been returned. If you run the
command again, you will find that modifiedCount will be 0, since the age was already 23 for the employee with ID 2.
To modify multiple documents in one shot, the updateMany() method has to be used. The format is the same as the updateOne() method, but the effect is that all documents that match will be modified. Let’s add an organization field to all employees using the updateMany() method:

` > db.employees.updateMany({},{$set: { organization: 'MyCompany' } }) `

Note that even though the field organization did not exist in the documents, the new value MyCompany would have been applied to all of them. If you execute the command find() to show the companies alone in the projection, this fact will be confirmed.
There is also a method to replace the complete document called replaceOne(). Instead of specifying which fields to modify, if the complete modified document is available, it can be used to just replace the existing document with the new one. Here’s an example:

```js
db.employees.replaceOne({ id: 4}, {
 id: 4,
 name: { first: 'Bobby' },
 age: 64
});
```

This command will replace the existing document with ID 4, with the new one. The fact that the organization and name.last fields were not specified will have the effect that these fields will not exist in the replaced document, as opposed to not changed using updateOne(). Getting the replaced object should show proof of that:

` > db.employees.find({id: 4}); `

This should result in a document that looks as follows:

```js
[
  {
    _id: ObjectId("625dcda37185ea0a7845e9e0"),
    id: 4,
    name: { first: 'Bobby' },
    age: 66
  }
]
```

You can see that it no longer has the fields name.last and organization, because these were not specified in the document that was supplied to the command replaceOne(). It just replaces the document with the one supplied, except for the field ObjectId. Being the primary key, this field cannot be changed via
an updateOne() or a replaceOne().

### Delete 

The delete operation takes a filter and removes the document from the collection. The filter format is the same, and the variations deleteOne() and deleteMany() are both available, just as in the update operation. Let’s delete the last document, with ID 4:

` > db.employees.deleteOne({id: 4}); `

This should result in the following output, confirming that the deletion affected only one document:
<hr>
{ acknowledged: true, deletedCount: 1 }
<hr>

Let’s also cross-check the deletion by looking at the size of the collection. The count() method on the collection tells us how many documents it contains. Executing that now should return the value 3, because we originally inserted four documents.

` > db.employees.count(); `

### Aggregate

The find() method is used to return all the documents or a subset of the documents in a collection. Many a time, instead of the list of documents, we need a summary or an aggregate, for example, the count of documents that match a certain criterion.
The count() method can surely take a filter. But what about other aggregate functions, such as sum? That is where the aggregate() comes into play. You can look up the advanced features that the aggregate() function supports in the MongoDB documentation at https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
The aggregate() method works in a pipeline. Every stage in the pipeline takes the input from the result of the previous stage and operates as per its specification to result in a new modified set of documents. The initial input to the pipeline is, of course, the entire collection. The pipeline specification is in the form of an
array of objects, each element being an object with one property that identifies the pipeline stage type and the value specifying the pipeline’s effect.
For example, the find() method can be replicated using aggregate() by using the stages $match (the filter) and $project (the projection). To perform an actual aggregation, the $group stage needs to be used. The stage’s specification includes the grouping key identified by the property `_id` and other fields as keys,
whose values are aggregation specifications and fields on which the aggregation needs to be performed. The `_id` can be null to group on the entire collection.
Let’s try this by getting the total age of all employees in the entire collection. In the value, `_id` will be set to null because we don’t want to group by any field. We’ll need to sum (using the aggregate function $sum) the field age into a new field called total_age like this:

```js
> db.employees.aggregate([
 { $group: { _id: null, total_age: { $sum: '$age' } } }
 ]);
```

This should result in an output like this:

` [ { _id: null, total_age: 99 } ] `

The same function, $sum, can be used to get a count of the records by simply summing the value 1:

```js
> db.employees.aggregate([
 { $group: { _id: null, count: { $sum: 1 } } }
])
```

To group the aggregate by a field, we’ll need to specify the name of the field (prefixed by a $) as the value of `_id`. Let’s use the organization field, but before that, let’s insert a new document with an organization different from the rest of the documents (which were all set to MyCompany):

```js
> db.employees.insertOne({
 id: 4,
 name: { first: 'Bob', last: 'B' },
 age: 64,
 organization: 'OtherCompany'
})
```

Now, here’s the command that aggregates the age using sum across different organizations:


```js
> db.employees.aggregate([
 { $group: { _id: '$organization', total_age: { $sum: '$age' } } }
])
```

This should result in an output like this:

```js
[
  { _id: 'OtherCompany', total_age: 64 },
  { _id: null, total_age: 99 }
]
```

Let’s also try another aggregate function, say average, using $avg

```js
> db.employees.aggregate([
 { $group: { _id: '$organization', average_age: { $avg: '$age' } } }
])
```

This should now result in an output like this:

```js
[
  { _id: 'OtherCompany', average_age: 64 },
  { _id: null, average_age: 33 }
]
```

There are other aggregation functions, including minimum and maximum. For the complete set, refer to the documentation at https://docs.mongodb.com/manual/reference/operator/aggregation/group/#accumulator-operator.
