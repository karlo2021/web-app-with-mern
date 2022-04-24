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

You can now test the script using the command line and Node.js as before, and you’ll see the effect of
different environment variables, both in the shell as well as in the .env file. We need to make a similar set of changes for the UI server. In this case, the variables we need to use are:

•	 The UI server port<br/>
•	 The API endpoint to call

The UI server port changes are similar to the API server port changes. Let’s get that done first. Just as for the API server, let’s install the dotenv package.

<pre>
$ cd ui
$ npm install dotenv@6
</pre>

Then, in the ui/uiserver.js file, let’s require and configure dotenv:

```js
...
require('dotenv').config();
...
```

Let’s also change the hard-coded port to use the environment variable:

<pre>
...
<b>const port = process.env.UI_SERVER_PORT || 8000;</b>
...
app.listen(<del>8000</del> <b>port</b>, function() {
  <del>console.log('UI started on port 8000');</del>
  <b>console.log(`UI started on port ${port}`);</b>
});
...
</pre>

Unlike these changes, the API endpoint has to somehow get to the browser in the form of JavaScript
code. It is not something that can be read from an environment variable, because that is not transmitted to the browser.

One way to do this is to replace a predefined string within the code with the variable’s value as part
of the build and bundle process. I’ll describe this method in the next section. Although this is a valid and preferred choice for many people, I have chosen to make the configuration a runtime variable as opposed to a compile-time one. That’s because on the real UI servers, the way to set the server port and the API endpoint will be uniform.<br/>
To do this, let’s generate a JavaScript file and inject that into index.html. This JavaScript file will contain a global variable with the contents of the environment. Let’s call this new script file env.js and include it in index.html. This is the only change to index.html in this section, and it’s shown in <b>Listing 7-10.</b>

<b><i>Listing 7-10.</i></b> ui/public/index.html: Include the Script /env.js

```html
...
  <div id="contents"></di>

  <scripts src="/env.js"></scripts>
  <scripts src="/App.js"></scripts>
...
```

Now, within the UI server, let’s generate the contents of this script. It should result in setting a global variable called ENV with one or more properties that are set to environment variables, something like this: 

```js
...
window.ENV = {
  UI_API_ENDPOINT: "http://localhost:3000/graphql"
}
...
```

When the JavaScript is executed, it will initialize the global variable ENV to the object. When the variable is needed in any other place, it can be referred from the global variable. Now, in the UI server code, let’s first initialize a variable for the API endpoint and default it if not found.
Then we’ll construct an object with just this one variable as a property.

```js
...
const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
const env = { UI_API_ENDPOINT };
...
```

Now, we can create a route in the server that responds to a GET call for env.js. Within the handler for
this route, let’s construct the string as we need, using the env object, and send it as the response:

```js
...
app.get('/env.js', function(req, res) {
  res.send(`window.ENV = ${JSON.stringify(env)}`)
})
...
```

The complete changes to ui/uiserver.js are shown

<pre>
<b>require('dotenv').config();</b>
const express = require('express');

const app = express();
app.use(express.static('public'));

<b>
const UI_API_ENDPOINT = process.env.UI_API_ENPOINT || 'http://localhost:3000/graphql';
const env = { UI_API_ENDPOINT };

app.get('/env.js', function(req, res) {
  res.send(`window.ENV = ${JSON.stringify(env)}`)
})</b>

<b>const port = process.env.UI_SERVER_PORT || 8000;</b>

app.listen(<del>8000</del><b>port</b>, function() {
  <del>console.log('UI started on port 8000');</del>
  <b>console.log(`UI started on port: ${port}`);</b>
});
</pre>
Just like for the API server, let’s create an .env file to hold two variables, one for the server’s port and the other for the API endpoint the UI needs to access. You could use a copy of the sample.env file, whose contents are shown:

<pre>
UI_SERVER_PORT=8000
UI_API_ENDPOINT=http://localhost:3000/graphql
</pre>

Finally, in App.jsx, where the API endpoint is hard-coded, let’s replace the hard-coding with a property
from the global ENV variable. This change is shown:

<pre>
...
async function graphQLFetch(query, variables = {}) {
  try {
    <del>const response = await fetch('http://localhost:3000/graphql', {</del>
      <b>const response = await fetch(window.ENV.UI_API_ENDPOINT, {</b>
    ...
  ...
}
...
</pre>

Let’s also make nodemon watch for changes in the .env file. Since we are specifying individual files to
watch in the UI server, this requires us to add another file to watch for using the -w command line option. The changes to ui/package.json are shown.

<pre>
...
  "scripts": {
    "start": "nodemon -w uiserver.js <b>-w .env</b> uiserver.js",
...
</pre>

Now, if you test the application with the default ports and endpoints, the application should be working
as before. If you have been running npm run watch in a console, the changes to App.jsx would have been
automatically recompiled.

You can also ensure that a change to any of the variables, both via an actual environment variable and a
change in the .env file (if you have one), do take effect. If you change a variable via an environment variable do remember to export it if you are using the bash shell. Also, the server has to be restarted since nodemon does not watch for changes to any environment variable.
