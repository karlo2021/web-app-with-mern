# Stateless Components

We have three functioning React components (IssueAdd, IssueRow and IssueTable) composed hierarchically into IssueList. IssueList has lots of methods, a state, initialization of the state, and functions that modify the state. In comparison, IssueAdd has some interactivity, but no state. But, if you notice, IssueRow and IssueTable have nothing but a `render()` method.

For performance reasons and for clarity of code, it is recommended that such components are written as functions rather than classes. If a component does not depend on props, it can be written as a simple function whose name is the component name. For example, consider the following Hello World class we wrote in the beginning (React Components)

```js
class HelloWrold extends React.Component
{
  render() {
    return(
      <div title="Outer div" >
        <h1>Hello World</h1>
      </div>
    );
  }
}
...
```

this can be rewritten as pure function like this:

```js
...
function HelloWorld() {
  return(
    <div title="Outer div" >
      <h1>Hello World</h1>
    </div>
  );
}
...
```

If the rendering depends on the props alone (more often than not, this will indeed be the case), the function can be written with one argument as the props, which can be accessed within the function’s JSX body. Say the Hello World component takes in a message as part of the props

```js
...
function HelloWorld(props) {
  return(
    <div title="Outer div">
      <h3>{props.message}</h3>
    </div>
  );
}
...
```

An even more concise form using an arrow function can be used when the rendered output can be represented as a JavaScript expression, that is, a function with no other statement than just the return statement:

```js
...
const HelloWorld = (props) => (
  <div title="Outer div" >
    <h3>{props.message}</h3>
  <div>
);
...
```

This HelloWorld component could have been instantiated like this:

`<HelloWorld message="Hello World" />`

Since IssueRow and IssueTable are stateless components, let’s change them to pure functions

```js
function IssueRow (props) {
  const issue = props.issue;
  return(
    <tr>
      <td>{issue.id}</th>
      <td>{issue.status}</th>
      <td>{issue.owner}</th>
      <td>{issue.created.toDateString()}</th>
      <td>{issue.effort}</th>
      <td>{issue.due ? issue.due.toDateString() : ''}</th>
      <td>{issue.title}</th>
    </tr>
  );
}
...
function IssueTable(props) {
  const issueRows = props.issues.map(issue => (
    <IssueRow key={issue.id} issue={issue} />
  );
  retrun(
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}
...
```
