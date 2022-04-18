# MongoDB

Until now, we had an array of issues in the Express server’s memory that we used as the database. We’ll replace this with real persistence and read and write the list of issues from a MongoDB database.
To achieve this, we’ll need to install or use MongoDB on the cloud, get used to its shell commands, install a Node.js driver to access it from Node.js, and finally modify the server code to replace the API calls to read and write from a MongoDB database instead of the in-memory array of issues.

## MongoDB Basics

This is an introductory section, where we will not be modifying the application. We’ll look at these core concepts in this section: MongoDB, documents, and collections. Then, we’ll set up MongoDB and explore these concepts with examples using the mongo shell to read and write to the database.
