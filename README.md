
## Dynamic Composition

In this section, we’ll replace our hard-coded set of IssueRow components with a programmatically generated set of components from an array of issues.
Expand the scope of the issue from just an ID and a title to include as many fields of an issue
as we can

 > App.jsx: In-Memory Array of Issues

```js
const issues = [
  {
    id: 1, status: 'New', owner: 'Ravan', efforts: 5,
    creadted: new Date('2022-03-15'), due: unified,
    title: 'Error in console when clicking Add'
  },
  {
    id: 2, status: 'Assigned', owner: 'Eddie', efforts: 15,
    creadted: new Date('2022-04-05'), due: new Date('2022-04-19'),
    title: 'Missing bottom border on panel'
  },
];
```

Modify the IssueTable class to use this array of issues rather than the hard-coded list
Within the IssueTable class’ render() method, let’s iterate over the array of issues and generate an array of IssueRows from it.

```js
...
const issueRows = issue.map(issue => <IssueRow rowStyle={rowStyle} issue={issue} />);
...
```

Replace the two hard-coded issue components inside IssueTable with this variable within the `<tbody>` element like this:

```js
...
  <tbody>
    {issueRows}
  </tbody>
...
```

Specifying the style for each cell is becoming tedious, so let’s create a class for the table, name it table-bordered, and use CSS to style the table and each table-cell. This stylewill need to be part of index.html

<pre>
...
  <script src="https://unpkg.com/@babel/polyfill@7/dist/polyfill.min.js"></script>
  <style>
    table.bordered-table th, td{border: "1px solid black"; padding: 4;}
    table.bordered-table{border-collapse: collapse;}
  </style>
</head>
...
</pre>

Now, we can remove rowStyle from all the table-cells and table-headers  

## Identify each instance of IssueRow with an attribute called key

The value of this key can be
anything, but it has to uniquely identify a row. We can use the ID of the issue as the key, as it uniquely identifies the row.

 > App.jsx: IssueTable Class with IssueRows Dynamically Generated and Modified Header

```js
class TableIssue extends React.Component{
    render(){
      const issueRows = issues.map(issue => 
      <IssueRow key={issue.id} issue={issue} />
      );

      return(
        <table className="bordered-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Effort</th>
              <th>Due Date</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {issueRows}
          </tbody>
        </table>
      );
    }
}
```

Since React does not automatically call toString() on objects that are to be displayed, the dates have to be explicitly converted to strings. The toString() method results in a long string, so let’s use toDateString() instead.optional, we need to also check for its presence before calling toDateString() on it. Since the field due is optional, we need to also check for its presence before calling <mark>toDateString()</mark> on it. An easy way to do this is to use the ternary ? -:

```js
  issue.due ? issue.due.ToDateString() : ''
```

The ternary operator is handy because it is a JavaScript expression, and it can be used directly in place of the display string. Otherwise, to use an if-then-else statement, the code would have to be outside the JSX part, in the beginning of the render() method implementation.
The new IssueRow class is

```js
class IssueRow extends React.Component{
  render(){
    cosnt issue = this.props.issue;
    
    return(
      <tr>
        <td>{issue.id}</td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.created.ToDateString()}</td>
        <td>{issue.effort}</td>
        <td>{issue.due ? issue.due.ToDateString() : ''}</td>
        <td>{issue.title}</td>
      </tr>
    );
  }
}
```
