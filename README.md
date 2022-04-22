# Multiple Environments

We postponed removing hard-coded things such as the port numbers and MongoDB URL. Now that the
directory structure has been finalized, it’s perhaps a good time to remove all hard-coding and keep these as variables that can be changed more easily.

Typically, there would be three deployment environments: development, staging, and production. The
server ports and MongoDB URL for each of these would be quite different. For example, the ports of both the API server and the UI server would be 80. We used two different ports because both servers were run on the same host, and two processes cannot listen on the same port. Also, we used ports like 8000 because using port 80 requires administrative privileges (superuser rights).

Rather than predetermine the ports and the MongoDB URL based on possible deployment targets such
as development, staging, and production, let’s keep the variables flexible so that they can be set to anything at runtime. A typical way of supplying these is via environment variables, especially for remote targets and production servers. But during development, it’s nice to be able to have these in some configuration file so that the developers don’t need to remember to set these up every time.

Let’s use a package called dotenv to help us achieve this. This package can convert variables stored
in a file into environment variables. Thus, in the code, we only deal with environment variables, but the
environment variables can be supplied via real environment variables or configuration files.

The dotenv package looks for a file called .env, which can contain variables defined like in a shell. For
example, we could have the following line in this file:

```js
...
DB_URL=mongodb://localhost/issuetracker
...
```

In the code, all we’d have to do is look for the environment variable DB_URL using process.env.DB_URL
and use the value from it. This value can be overridden by an actual environment variable defined before
starting the program, so it is not necessary to have this file. In fact, most production deployments would take the value only from the environment variable. Let’s now install the package, first in the API server:

```
$ cd api
$ npm install dotenv@6
```

To use this package, all we need to do is to require it and immediately call config() on it.

```js
...
require('dotenv').config();
...
```
Now, we can use any environment variable using process.env properties. Let’s first do that in server.js,
for the MongoDB URL. We already have a variable url, which we can set to DB_URL from process.env and
default it to the original localhost value if it is undefined:

<pre>
...
const url = <b>process.env.DB_URL || </b>'mongodb://localhost/issuetracker';
...
</pre>

Similarly, for the server port, let’s use an environment variable called API_SERVER_PORT and use a
variable called port within server.js like this:

```js
...
const port = process.env.API_SERVER_PORT || 3000;
...
```

Now we can use the variable port to start the server.

<pre>
...
  app.listen(<del>3000</del><b>port</b>, function() {
    <del>console.log('API server started on port 3000');</del>
    <b>console.log(`API server started on port ${port}`);</b>
  ...
</pre>

Note the change of quote style from a single quote to back-ticks because we used string interpolation.
The complete set of changes to the api/server.js file are shown:

<pre>
...
const fs = require('fs');<b>
require('dotenv').config();</b>
const express = require('express');
...
const url = <b>process.env.DB_URL || </b>'mongodb://localhost/issuetracker';
<del>// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';
// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';</del>
...
<b>const port = process.env.API_SERVER_PORT || 3000;</b>

(async funciton () {
  try {
    ...
    app.listen(<del>3000</del><b>port</b>, function() {
      <del>console.log('API server started on port 3000');</del>
      <b>console.log(`API server started on port ${port});</b>
    });
  ...
...
</pre>

Let’s also create a file called .env in the api directory. There is a file called sample.env that I have
included in the GitHub repository that you may copy from and make changes to suit your environment,
especially the DB_URL. The contents of this file are shown:

<pre>
## DB
# Local
DB_URL=mongo://localhost/issuetracker

# Atlas - replace UUU: user, PPP: password, XXX: hostname
# DB_URL=mongodb+srv://UUU:PPP@XXX.mongodb.net/issuetracker?retryWrites=true

# mLab - replace UUU: user, PPP: password, XXX: hostname, YYY: port
# DB_URL=mongodb://UUU:PPP@XXX.mlab.com:YYY/issuetracker

## Server Port
API_SERVER_PORT=3000
</pre>

It is recommended that the .env file itself not be checked into any repository. Each developer and
deployment environments must specifically set the variables in the environment or in this file as per their needs. This is so that changes to this file remain in the developer’s computer and others’ changes don’t overwrite a developer’s settings.

It’s also a good idea to change the nodemon command line so that it watches for changes to this file.
Since the current command line does not include a watch specification (because it defaults to ".", that is, the current directory), let’s include that as well. The changes to this script in package.json are shown:

<pre>
...
  "scripts": {
    "start": "nodemon -e js,graphql <b>-w . -w .env</b> server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
...
</pre>

Now, if you specify API_SERVER_PORT as 4000 in the file .env and restart the API server (because
nodemon needs to know the new watch files), you should see that it now uses port 4000. You could undo this change and instead define an environment variable (do not forget to use export in the bash shell to make the variable available to sub-processes) and see that the change has indeed been made. Note that the actual environment variables take precedence over (or override) the same variable defined in the .env file.

Let’s also make a similar set of changes to api/scripts/trymongo.js to use the environment variable DB_URL. These changes are shown in Listing _7-9_. There are also changes to print out the URL after connecting, to cross-check that the environment variable is being used.

<b>_Listing 7-9._</b> api/scripts/trymongo.js: Read DB_URI from Environment Using doenv

<pre>
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = <b>process.env.DB_URL ||</b> 'mongodb://localhost/issuetracker';
<del>
// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';</del>
...
client.connect(function(err, client) {
  ...
  <del>console.log('Connected to MongoDB');</del>
  <b>console.log('Connected to MongoDB URL', url);</b>
  ...
  await client.connect();
  <del>console.log('Connected to MongoDB');</del>
  <b>console.log('Connected to MongoDB URL', url);</b>
</pre>