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