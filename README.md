# Integrated List Api

Now that we have the List API working, let’s get it integrated into the UI. In this section, we will replace the implementation of the loadData() method in the IssueList React component with something that fetches the data from the server.
To use the APIs, we need to make asynchronous API calls, or Ajax calls. The popular library jQuery
is an easy way to use the $.ajax() function, but including the entire jQuery library just for this purpose seems like overkill. Fortunately, there are many libraries that provide this functionality.
Better still, modern browsers support Ajax calls natively via the Fetch API. For older browsers such as Internet Explorer, a polyfill for the Fetch API is available from whatwg-fetch. Let’s use this polyfill directly from a CDN and include it in index.html.

```js
...
<script src="https://unpkg.com/@babel/polyfill@7/dist/polyfill.min.js"></script>
<b><script src="https://unpkg.com/whatwg-fetch@3.0.0/dist/fetch.umd.js"></script></b>
...
```

Next, within the loadData() method, we need to construct a GraphQL query. This is a simple string like
what we used in the Playground to test the issueList GraphQL field. But we’ve to ensure that we’re querying for all subfields of an issue

```js
...
  const query = `query {
    issueList {
      id title status owner
      created effort due 
    }
  }`;
...
```

We’ll send this query string as the value for the query property within a JSON, as part of the body to the fetch request. The method we’ll use is POST and we’ll add a header that indicates that the content type is JSON. Here’s the complete fetch request:

```js
...
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringfy({ query }),
  });
...
```

 > We used the await keyword to deal with asynchronous calls. This is part of the ES2017 specification
 > and is supported by the latest versions of all browsers except Internet Explorer. It is automatically 
 > handled by Babel transforms for older browsers. Also, await can only be used in functions that are
 > marked async. We will have to add the async keyword to the loadData() function soon. If you are not 
 > familiar with the async/await construct, you can learn about it at 
 > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function.

Once the response arrives, we can get the JSON data converted to a JavaScript object by using the
response.json() method. Finally, we need to call a setState() to supply the list of issues to the state
variable called issues, like this:

```js
...
  const result = await response.json();
  this.setState({ issue: result.data.issueList })
...
```

We will also need to add the keyword async for the function definition of loadData() since we have
used awaits within this function.
At this point, you will be able to refresh the Issue Tracker application in the browser, but you will see
an error. This is because we used a string instead of Date objects, and a call to convert the date to a string using toDateString() in the IssueRow component’s render() method throws an error. Let’s remove the
conversions and use the strings as they are:

```js
  <td>{issue.created}</td>
  ...
  <td>{issue.due}</td>
```

We can also now remove the global variable initialIssues, as we no longer require it within loadData(). The complete set of changes in App.jsx is shown in Listing

<pre>
<del>const initialIssues = [
  {
    id: 1, status: 'New', owner: 'Ravan', effort: 5,
    created: new Date('2018-08-15'), due: undefined,
    title: 'Error in console when clicking Add',
  },
  {
    id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
    created: new Date('2018-08-16'), due: new Date('2018-08-30'),
    title: 'Missing bottom border on panel',
  },
];</del>

function IssueRow(props) {
  const issue = props.issue;
  render() {
    return(
      ...
        <td>{issue.created<del>.toDateString()}</td></del>
        <td>{issue.effort}</td>
        <td>{issue.due <del>? issue.due.toDateString() : ''}</td></del>
      ...
    );
  }
}

<b>async</b> loadData() {
  <del>setTimeout(() => {
    this.setState({issues: initialIssues})
  }, 500);</del>
  <b>const query = `query {
    issueList {
      id title status owner
      created effort due
    }
  }`;

  const response = await fetch('/graphql', {
    method: POST,
    headers: {'Content-type: 'application/json'},
    body: JSON.stringify({ query })
  });
  const result = await response.json();
  this.setState({issues: result.data.issueList});
}</b>
</pre>

![expected-output](./resources/expected-output.JPG)

You will notice that the dates are long and ungainly, but otherwise, the screen looks the same as it did at the end of the previous chapter. An Add operation will not work, because it uses Date objects rather than strings when adding a new issue. We will address these two issues in the next section.