# Displaying Errors

In this section, we’ll modify the user interface to show any error messages to the user. We’ll deal with
transport errors due to network connection problems as well as invalid user input. Server and other errors should normally not occur for the user (these would most likely be bugs), and if they do, let’s just display the code and the message as we receive them.
This is a good opportunity to create a common utility function that handles all API calls and report
errors. We can replace the fetch calls within the actual handlers with this common function and display
to the user any errors as part of the API call. Let’s call this function graphQLFetch. This will be an async function since we’ll be calling fetch() using await. Let’s make the function take the query and the variables as two arguments:

```js
...
async function graphQLFetch(query, variables = {}) {
    ...
}
```

 > We used the ES2015 Default Function parameter to assign {} to the parameter variables in case it was 
 > not passed in by the caller. Read more about this feature at 
 > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters.

All transport errors will be thrown from within the call to fetch(), so let’s wrap the call to fetch() and the subsequent retrieval of the body and parse it within a try-catch block. Let’s display errors using alert in the catch block:

```js
...
  try {
    const response = await fetch('/graphql', {
      ...
    });
    ...
  } catch(e) {
    alert (`Error in sending data to server: ${e.message}`);
  }
...
```

The fetch operation is the same as originally implemented in issueAdd. Once the fetch is complete, we’ll look for errors as part of result.errors.

```js
...
  if (result.errors) {
    const error = result.errors[0];
...
```

The error code can be found within error.extensions.code. Let’s use this code to deal with each type
of error that we are expecting, differently. For BAD_USER_INPUT, we’ll need to join all the validation errors together and show it to the user:

```js
...
  if (error.extensions.code == 'BAD_USER_INPUT') {
    const details = error.extensions.exceptions.errors.join('\n');
    alert(`${error.message}:\n ${details}`);
  ...
```

For all other error codes, we’ll display the code and the message as they are received

```js
...
  } else {
    alert(`${error.extensions.code}: ${error.message}`);
  }
...
```

Finally, in this new utility function, let’s return result.data. The caller can check if any data was
returned, and if so, use that. The method loadData() in IssueList is the first caller. After building the query, all the code to fetch the data can be replaced with a simple call to graphQLFetch with the query. Since it is an async function, we can use the await keyword and receive the results directly to a variable called data. If the data is non-null, we can use it to set the state like this:

```js
...
async loadData() {
  ...
  const data = await graphQLFetch(query);
  if (data) {
    this.setState({ issues: data.issueList });
  }
}
```

Let’s make a similar change to createIssue method in the same class. Here, we also need to pass a
second argument, the variables, which is an object containing the issues variable. On the return path, if the data is valid, we know that the operation was successful and so we can call this.loadData(). We don’t use the return value of data except for knowing that the operation was successful.

```js
...
const data = await graphQLFetch(query, {issue});
if (data) {
  this.loadData();
}
...
```

The complete set of changes in App.jsx to display errors is shown

<pre>
...
<b>async function graphQL(query, variables = {}) {
  try {
    const response = await fetch('\graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT')
      {
        const details = error.extensions.exceptions.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch(e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}</b>
...
class IssueList extends React.Component {
  ...
  async loadData() {
    const query = `query {
      ...
    }`;

    <del>const response = await fetch('/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    this.setState({ issues: result.data.issueList });</del>
    <b>const data = await graphQLGFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }</b>
  }
  
  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInput!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    <del>const resonse = await fetch('\graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables: { issue } })
    });</del>
    <del>this.loadData()</del>
    <b>const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    } </b>
  }
}
</pre>

To test transport errors, you can stop the server after refreshing the browser and then try to add a new
issue. If you do that, you will find the error message like the screenshot:

As for the other messages, the length of title can be tested by typing a small title in the user input. The other validations have to be tested only by temporarily changing the code, for example, by setting the status to the desired value and setting the due field to an invalid date string etc. within the IssueAdd component’s handleSubmit() method.

## Summary