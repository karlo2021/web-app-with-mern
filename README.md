# Create API Integration

Let’s start the integration of the Create API with a minor change in the defaulting of the new issue in the UI. Let’s remove setting the status to 'New' and set the due date to 10 days from the current date. This change can be done in the handleSubmit() method in the IssueAdd component in App.jsx

<pre>
...
  const issue =  {
    owner = form.owner.value, title: form.title.value, <del>status: 'New'</del>,
    <b>due: new Date(new Date().getTime() + 1000*60*60*24*10),</b>
  }
...
</pre>

Before making the API call, we need a query with the values of the fields filled in. Let’s use a template
string to generate such a query within the createIssue() method in IssueList. We can use the title and
owner properties of the passed-in issue object as they are, but for the date field due, we have to explicitly convert this to a string as per the ISO format, because that’s the format we decided for passing dates.
On the return path, we won’t be needing any of the new issue’s values, but since the subfields cannot be
empty, let’s just specify the id field. So, let’s form the query string as follows:

```js
...
  const query = `mutation {
    issueAdd(issue: {
      title: "${issue.title}",
      owner: "${issue.owner}",
      due: "${issue.due.toISOStirng()}",
    }) {
      id
    }
  }`;
...
```

Now, let’s use this query to execute fetch asynchronously as we did for the Issue List call:

```js
...
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({query})
  });
...
```

We could use the complete issue object that is returned and add it to the array in the state as we did
before, but it’s simpler (although less performant) to just refresh the list of issues, by calling loadData() after sending the new issue off to the server. It is also more accurate, just in case there were errors and the issue couldn’t be added, or even if more issues were added by some other user in the meantime.

```js
...
  this.loadData();
...
```

The complete set of changes to integrate the Create API is shown 

<pre>
...
class IssueAdd extends React.Component {
  ...
  handleSubmit(e) {
    ...
    cosnt issue = {
      owner: form.owner.value, title: form.title.value, <del>status: 'New'</del>,
      <b>due: new Date(new Date().getTime() + 1000*60*60*24*10),</b>
    }
    ...
  }
  ...
}
...
  <b>async</b> createIssue(issue) {
    <del>issue.id = this.state.issues.length + 1;
    issue.created = new Date();
    const newIssueList = this.state.issues.slice();
    newIssueList.push(issue);
    this.setState({issues: newIssueList});</del>
    <b>const query = `mutation {
      issueAdd(issue: {
        title: "${issue.title}",
        owner: "${issue.owner}",
        due: "${issue.due.toISOString()}",
      }) {
        id
      }
    }`;

    const response = await fetch('\graphql', {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({ query })
    });
    this.loadData();</b>
  }