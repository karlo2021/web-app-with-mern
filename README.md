# Writing to MongoDB

In order to completely replace the in-memory database on the server, we’ll also need to change the Create API to use the MongoDB database. 
We used the size of the in-memory array to generate the new document’s id field. We could do the same, using the count() method of the collection to get the next ID. But there is a small chance when there are multiple users using the application that a new document is created between the time we call the count() method and the time we call the insertOne() method. What we really need is a reliable way of generating a sequence of numbers that cannot give us duplicates, much like sequences in popular relational databases.

MongoDB does not provide such a method directly. But it does support an atomic update operation, which can return the result of the update. This method is called findOneAndUpdate(). Using this method, we can update a counter and return the updated value, but instead of using the $set operator, we can use the $inc operator, which increments the current value.

Let’s first create a collection with the counter that holds a value for the latest Issue ID generated. To make it a bit generic, let’s assume we may have other such counters and use a collection with an ID set to the name of the counter and a value field called current holding the current value of the counter. In the future, we could add more counters in the same collections, and these would translate to one document for each counter.

To start, let’s modify the schema initialization script to include a collection called counters and populate that with one document for the counter for issues. Since there are insertions that create a few sample issues, we’ll need to initialize the counter’s value to the count of inserted documents. Changes in init.mongo.js are shown:

<pre>
...
print('Inserted', count, 'issues');

<b>db.counters.remove({ id: 'issues' });
db.counters.insert({ id: 'issues', current: count });</b>
...
</pre>

Let’s run the schema initialization script again to make this change take effect:

`$ mongosh issuetracker scripts/init.mongo.js `
` mongosh "mongodb+srv://cluster0.wpj19.mongodb.net/issuetracker" --username karlo --password mernstack2021 scripts/init.mongo.js `

Now, a call to findOneAndUpdate() that increments the current field is guaranteed to return a unique value that is next in the sequence. Let’s create a function in server.js that does this, but in a generic manner. We’ll let it take the ID of the counter and return the next sequence. In this function, all we have to do is call findOneAndUpdate(). It identifies the counter to use using the ID supplied, increments the field called current, and returns the new value. By default, the result of the findOneAndUpdate() method returns the original document. To make it return the new, modified document instead, the option returnOriginal has to be set to false.

The arguments to the method findOneAndUpdate() are (a) the filter or match, for which we used `_id`, then (b) the update operation, for which we used a $inc operator with value 1, and finally, (c) the options for the operation. Here’s the code that will do the needful:

```js
...
async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdateOne(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false }
  );
  return result.value.current; 
}
...    
```

 >  The option for returning the current or new value is called differently in the Node.js driver and in the mongo shell. In the mongo shell, the option is called
 returnNewDocument and the default is false. In the Node. js driver, the option is called returnOriginal and the default is true. In both cases, the default
 behavior is to return the original, so the option must be specified to return the new document


Now, we can use this function to generate a new ID field and set it in the supplied issue object in the resolver issueAdd(). We can then write to the collection called issues using insertOne(), and then read back the newly created issue using findOne().


```js
...
  issue.id = await getNextSequence('issues');
  
  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });
  return savedIssue;
...
```

Finally, we can get rid of the in-memory array of issues in the server. Including this change, the complete set of changes in **server.js** is represented: 

<pre>
...
<del>const issueDB = [
  {
    id: 1
    ...
];</del>
...
<b>async function getNextSequence(name) {
  const result = await db.colleciton('counters').findOne(
    { _id: name },
    { $inc { current: 1 } },
    { returnOriginal: false }
   );
   return result.current.value;
}

async</b> function issueAdd(_, { issue }) {
  const errors = [];
  ...
  const created = new Date();
  <del>issue.id = issuesDB.length + 1;</del>
  <b>issue.id = await getNextSequence('issues');</b>
  
  <del>issuesDB.push(issue);</del>
  <b>const result = await db.collection('issues').insertOne(issue);</b>
  
  <del>return issue;</del>
  <b>const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });
  return savedIssue;</b>
  ...
</pre>

Testing this set of changes will show that new issues can be added, and even on a restart of the Node.js server, or the database server, the newly added issues are still there. As a cross-check, you could use the mongo shell to look at the contents of the collection after every change from the UI.

![add-button-teste](./resources/add-button-working.JPG)

## Summary

In this chapter, you learned about the installation and other ways of getting access to an instance of a
database in MongoDB. You saw how to use the mongo shell and the Node.js driver to access the basic
operations in MongoDB: the CRUD operations. We then modified the Issue Tracker application to use some
of these methods to read and write to the MongoDB database, thus making the issue list persistent.

Now that we have used the essentials of the MERN stack and have a working application, let’s take a
break from implementing features and get a bit organized instead. Before the application gets any bigger and becomes unwieldy, let’s modularize the code and use tools to improve our productivity. We’ll do this in the next chapter, by using Webpack, one of the best tools that can be used to modularize both the front-end and the back-end code.

## Q&A

Using the shell, display a list of methods available on the cursor object.
<br/>
As per the mongo shell documentation under "Access the mongo shell Help", you can find that there is a method called help() on many objects, including the cursor object. The way to get help on this is using db.collection.find().help().<br />
But since this is also a JavaScript shell like Node.js, pressing Tab will autocomplete and a double-Tab will show a list of possible completions. Thus, if you assign a cursor to a variable and press Tab twice after typing the variable name and a dot after that, the shell will list the possible completions, and that is a list of methods available on the cursor.
<hr>
Write a simple statement to retrieve all employees who have middle names.
<br />
This can be done using the $exists operator like this:
`> db.employees.find({ "name.middle": { $exists: true } })`
<hr>
Say an employee’s middle name was set mistakenly, and you need to remove it. Write a statement to do this
<br/>
The $unset operator in an update can be used to unset a field (which is actually different from setting it to null). Here is an example:<br />
`> db.employees.update(({_id: ObjectId("57b1caea3475bb1784747ccb")}, {"name.middle": {$unset: null}})`
<hr>
During index creation, what did the 1 indicate? What other valid values are allowed?
<br/>
The 1 indicates an ascending sort order for traversing the index. -1 is used to indicate a descending sort order.
<hr>
We used toArray() to convert the list of issues into an array. What if the list is too big, say, a million documents? How would you deal with this?
<br/>
One option is to use limit() on the result to limit the return value to a maximum number of records. For example, find().limit(100) returns the first 100 documents. If you were to paginate the output in the UI, you could also use the skip() method to specify where to start the list. If, on the other hand, you think the client can handle large lists but you don’t want to expend that much memory in the server, you could deal with one document at a time using hasNext() and next() and stream the results back to the client.
<hr>
Could we have just added the `_id` to the passed-in object and returned that instead of doing a find() for the inserted object?
<br/>
Adding the `_id` and returning the object passed in would have worked, so long as you know for a fact that the write was a success and the object was written to the database as is. In most cases, this would be true, but it’s good practice to get the results from the database, as that is the ultimate truth.
