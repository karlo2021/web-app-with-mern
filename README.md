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

  > <b>componentDidMount()</b>: This method is called as soon as the component’s
  > representation has been converted and inserted into the DOM. A setState() can be
  > called within this method 
  <br/>
  > <b>componentDidUpdate()</b>: This method is invoked immediately after an update occurs,
  > but it is not called for the initial render. this.setState() can be called within this
  > method. The method is also supplied the previous props and previous state as
  > arguments, so that the function has a chance to check the differences between the
  > previous props and state and the current props and state before taking an action 
  <br/>
  > <b>componentWillUnmount()</b>: This method is useful for cleanup such as cancelling
  > timers and pending network requests
  <br/>
  > <b>shouldComponentUpdate()<b/>: This method can be used to optimize and prevent a
  > rerender in case there is a change in the props or state that really doesn’t affect the
  > output or the view. This method is rarely used

The best place to initiate the loading of data in this case is the `componentDidMount()` method. `componentDidUpdate()` is an option as well, but since it may not be called for the initial render, let’s not use it.

```cs
...
componentDidMount() {
  this.loadData();
}
...
```

The complete set of changes in the IssueTable class is shown

<pre>
  ...
  class IssueTable extends React.Component
  {
    constructor() {
      super();
      <del>this.state = { issues: initialIssues };</del>
      <b>this.state = { issues: [] };</b>
    }
    <b>componentDidMount() {
      this.loadData();
    }
    loadData() {
      setTimeout(()=>{
      this.state({ issues: initialIssues });
      }, 500);
    }</b>
    ...
  }
</pre>