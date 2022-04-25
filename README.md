# ESLint

A linter (something that lints) checks for suspicious code that could be bugs. It can also check whether your code adheres to conventions and standards that you want to follow across your team to make the code
predictably readable.
While there are multiple opinions and debates on what is a good standard (tabs vs. spaces, for
example), there has been no debate on whether there needs to be a standard in the first place. For one team or one project, adopting one standard is far more important than adopting the right standard.
ESLint (https://eslint.org) is a very flexible linter that lets you define the rules that you want to
follow. But we need something to start off with and the rule set that has appealed to me the most has been that of Airbnb.
There are two parts to the Airbnb ESLint configuration: the base configuration applies to plain
JavaScript and the regular configuration includes rules for JSX and React as well. In this section, we’ll use ESLint for the back-end code alone, which means we’ll need to install the base configuration only, along with ESLint and other dependencies that the base configuration needs:

```
$ cd api
$ npm install --save-dev eslint@5 eslint-plugin-import@2
$ npm install --save-dev eslint-config-airbnb-base@13
```

ESLint looks for a set of rules in the .eslintrc file, which is a JSON specification. These are not the
definition of rules, instead, a specification of which rules need to be enabled or disabled. Rule sets also can be inherited, which is what we’ll do using the extends property in the configuration. Using a .eslintrc file makes the rules apply to all the files in that directory. For overrides in a single file, rules can be specified within comments in that file, or even just a single line.
Rules in the configuration file are specified under the property rules, which is an object containing
one or more rules, identified by the rule name, and the value being the error level. The error levels are off, warning, and error. For example, to specify that the rule quotes (which checks for single vs. double quotes for strings) should show a warning, this is how the rule needs to be specified:

```js
...
  rules: {
    "quotes": "warning"
  }
...
```

Many rules have options, for example, the rule quotes has an option for whether the quote type to be
enforced is single or double. When specifying these options, the value needs to be an array with the first element as the error level and the second (or more, depending on the rule) is the option. Here’s how the quotes rule can take an option indicating a check for double quotes:

```js
...
  "quotes": ["warning", "double"]
...
```


Let’s start with a basic configuration that only inherits from the Airbnb base configuration, without any
rules. Let’s also be specific about where the code is going to be run using the env property. Since all the backend code is meant only to be run on Node.js (and only on Node.js), this property will have a single entry for node with a value true. Here’s how the .eslintrc file will look at this stage:

```js
{
  "extends": "airbnb-base",
  "env": {
    "node": "true"
  }
}
```

Now, let’s run ESLint on the entire api directory. The command line to do this is as follows:

```
$ cd api
$ npx eslint .
```

Alternatively, you can install a plugin in your editor that shows lint errors in the editor itself. 
For most of the errors, we are just going to change the code to adhere to the suggested standard. But in
a few cases, we will make exceptions to the Airbnb rule. This could be for the entire project or, in some cases, for a specific file or line in a file.

### Stylistic Issues

JavaScript is quite flexible in syntax, so there are many ways to write the same code. The linter rules report some errors so that you use a consistent style throughout the project.

• Indentation: Consistent indentation is expected throughout; this needs no justification.

•	 Keyword spacing: Spaces between a keyword (if, catch, etc.) and opening parenthesis is recommended.

•	 Missing semicolon: There’s a lot of debate on whether semicolons everywhere or semicolons nowhere is better. Let’s go with the Airbnb default, which is to require a semicolon everywhere.

•	 _Strings must use single quotes:_ JavaScript allows both single and double quotes. In order to standardize, it’s better to consistently use one style. Let’s use Airbnb default, single quotes.

•	 _Object properties on a new line:_ Either all properties of an object have to be in one
line, or each property in a new line.

•	 _Space after { and before } in objects:_ This is just for readability; 

•	 _Arrow function style:_ The linter recommends using either parentheses around a single argument and a function body in curly braces, or no parentheses around the argument and a return expression (i.e., not a function body). Let’s make the suggested corrections.

### Best Practices

These rules are related to better ways of doing things, which typically helps you avoid errors.

•	 _Functions must be named:_ Omitting function names makes it harder to debug because the stack trace cannot identify the function. But this applies only to regular functions, not the arrow-style functions, which are expected to be short pieces of callbacks.

•	 _Consistent return:_ Functions should always return a value or never return a value, regardless of conditions. This reminds developers to add a return value or be explicit about it, just in case they have forgotten to return a value outside a condition.

•	 _Variables must be defined before use:_ Although JavaScript hoists definitions such that they are available throughout the file, it’s good practice to define them before use. Otherwise, it can get confusing while reading the code top to bottom.

•	 _Console:_ Especially in the browser, these are typically leftover debug messages, and therefore are not suitable to be shown in the client. But these are fine in a Node.js application. So, let’s switch this rule off in the API code.

•	 _Returning in assignments:_ Though it is concise, a return and an assignment together can be confusing to the reader. Let’s avoid it.

### Possible Errors

Consider these possible errors you might run across:

•	 _Redeclaring variables:_ It’s hard to read and understand the intent of the original coder when a variable shadows (overwrites) another variable in a higher scope. It’s also impossible to access the variable in the higher scope, so it’s best to give different names to variables.

•	 _Undeclared variables:_ It’s best to avoid a variable in an inner scope having the same name as one in the outer scope. It’s confusing, and it hides access to the outer scope variable in case it is required to be accessed. But in the mongo script, we do have variables that are really global: db and print. Let’s declare these as global variables in a comment so that ESLint knows that these are not errors:

```js
...
/* global db print */
...
```

•	 _Prefer arrow callback:_ When using anonymous functions (as when passing a callback to another function), it’s better to use the arrow function style. This has the added effect of setting the variable this to the current context, which is desirable in most cases, and the syntax is also more concise. If the function is large, it’s better to separate it out to a named regular function.

•	 Triple-equals: Usage of triple-equals ensures that the values are not coerced before comparison. In most cases, this is what is intended, and it avoids errors due to coerced values.

•	 Assignment to function parameters: Mutating passed-in parameters may cause the caller to be unware of the change and therefore unexpected behavior. Let’s avoid changing function parameters’ values and instead make a copy of the parameter.

•	 _Restricted globals:_ iNaN is considered a restricted global function because it coerces non-numbers to numbers. The function Number.isNaN() is recommended, but it works only on numbers, so let’s do a getTime() on the date objects before checking with Number.isNaN(). Also, print() is a restricted global, but its use in the mongo script is valid, so let’s switch off this rule only for the mongo script like this:

```js
...
/* eslint no-restricted-globals: "off" */
...
```

•	 _Wrap immediately invoked function expressions (IIFE):_ An immediately invoked function expression is a single unit. Wrapping it in parentheses not only makes it clearer, but also makes it an expression rather than a declaration.

The contents of the final .eslintrc file under the API directory are shown:

```json
{
  "extends": "airbnb-base",
  "env": {
    "node": "true"
  },
  "rules": {
    "no-console": "off"
  }
}
```

The changes to the JavaScript files under the API directory are shown in <b>Listings 7-18 to 7-20</b>:

<b><i>Listing 7-18.</i></b> api/scripts/init.mongo.js: Fixes for ESLint Errors

<pre>
/*
...
*/

<b>/* global db print */
/* eslint no-restricted-globals: "off" */</b>

db.issues.remove({});

const issueDB = [
  {
    <del>id: 1, status: 'New', owner: 'Ravan', effort: 5,
    created: new Date('2019-01-15'), due: undefined,</del>
    <b>id: 1,
    status: 'New',
    owner: 'Ravan',
    effort: 5,
    created: new Date('2019-01-15'),
    due: undefined,
    title: 'Error in console when clicking Add',</b>
  },
  {
    <del>id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
    created: new Date('2019-01-16'), due: new Date('2019-02-01'),</del>  
    <b>id: 2,
    status: 'Assigned',
    owner: 'Eddie',
    effort: 14,
    created: new Date('2019-01-16'),
    due: new Date('2019-02-01');
    title: 'Missing bottom border on panel',</b>
  },
...
</pre>

<b><i>Listing 7-19.</i></b> api/scripts/trymongo.js: Fixes for ESLint Errors

<pre>
function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  <del>client.connect(function(err, client) {</del>
  <b>client.connect((connErr) => {
    if (<del>err</del>connErr) {
      callback(<del>err</del>connErr);</b>
      return;
    }
    cosnole.log('Connected to MongoDB URL', url);
...
    const employee = { id: 1, name: 'A. Callback', age: 23 };
    <del>collection.insertOne(employee, function(err, result) {</del>
    <b>collection.insertOne(employee, (insertErr, result) => {</b>
      if (<del>err</del><b>insertErr</b>) {
        client.close();
        callback(<del>err</del><b>insertErr</b>);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      <del>collection.find({ _id: result.insertedId})</del>
      <b>collection.find({ _id: result.insertedId })</b>
        <del>.toArray(function(err, docs) {</del>
        <b>.toArray((findErr, docs) => {
          </b><del>if (err) {
            client.close();
            callback(err);
            return;
          }</del>
            <b>if (findErr) {
              client.close();
              callback(findErr);
              return;</b>
            }
          <del>console.log('Result of find:\n', docs);
          client.close();
          callback(err);</del>
        });
            <b>console.log('Result of find:\n', docs);
            client.close();
            callback();
        });</b>
    ...
async function testWithAsync() {
  ...
  <del>} catch(err){</del>
  <b>} catch(err) {</b>
  ...
}

<del>testWithCallbacks(function(err) { </del>
<b>testWithCallbacks((err) => {
  ...</b>
}
</pre>


