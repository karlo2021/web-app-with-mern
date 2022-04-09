# Async State Initialization

Although we set the initial state in the constructor, it is highly unlikely that regular SPA components will have the initial state available to them statically. These will typically be fetched from the server. The state can only be assigned a value in the constructor. After that, the state can be modified, but only via a call to React.Component’s `this.setState()` method

```js
...
 this.setState({ issues: newIssues });
...
```

Since at the time of constructing the component, we don’t have the initial data, we will have to assign an empty array to the issues state variable in the constructor.

```js
...
constructor() {
  this.state({ issues: [] });
...
```

The key difference between a global array of issues and a call to the server is that the latter needs an asynchronous call. Let’s add a method to the IssueTable class that asynchronously returns an array of issues. Eventually, we’ll replace this with an API call to the server, but for the moment, we’ll use a setTimeout() call to make it asynchronous.

```js
...
  loadData(){
    setTimeout(() => {
      this.setState({ issue: initialState });
    }, 500);
  }
```

The timeout value of 500 milliseconds is somewhat arbitrary: it’s reasonable to expect a real API call to
fetch the initial list of issues within this time.

Now, it is very tempting to call loadData() within the constructor of IssueTable. It may even seem to
work, but the fact is that the constructor only constructs the component and does not render the UI. 

React provides many other methods called lifecycle methods to cater to this and other situations where
something needs to be done depending on the stage, or changes in the status of the component. Apart from
the constructor and the render() methods, the following lifecycle methods of a component could be of
interest:
