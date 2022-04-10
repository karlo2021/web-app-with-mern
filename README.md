# Lifting state up

Let’s move the initiation of the creation to where it really belongs: in the IssueAdd component. Moving the timer for adding a new issue from the IssueTable component to the IssueAdd component is not as trivial as it first appears. If you do try to move it, you will immediately realize that the `createIssue()` method will also have
to move, or we need to have a variant within IssueAdd that can communicate back to IssueTable and call the `createIssue()` method. Only parents can pass information down to children; horizontal communication seems hard, if not impossible.

The way around this is to have the common parent contain the state and all the methods that deal with this state. By lifting the state up on level to IssueList, information can be propagated down to IssueAdd as well as to IssueTable. 

Let’s start by moving the state to IssueList and the methods to load the initial state.

<pre>
...
class IssueList extends React.Component{
  <b>constructor() {
    super();
    this.state = { issues: [] };
  }</b>
...
</pre>

The other methods that deal with the state are componentDidMount(), loadData(), and createIssue(). Let’s move these also to the IssueList class:

<pre>
class IssueList extends React.Component{
  ...
  <b>componentDidMount() { ... }
  loadData() { ... }
  createIssue(issue) { ... }</b>
  ...
</pre>

Now, IssueTable doesn’t have a state to construct the IssueRow components from. But you have already seen how data can be passed in from a parent to a child in the form of props. Let’s use that strategy and pass the array of issues from the state within IssueList to IssueTable via props:

```js
...
  <IssueTable issues={this.state.issues} />
...
```

And, within IssueTable, instead of referring to the state variable issues, we’ll need to get the same data from props:

<pre>
...
  <del> const issueRows = this.state.issues.map( issue =></del>
  const issueRows = this.<b>props</b>.issues.map( issue => 
...
</pre>

As for IssueAdd, we need to move the timer into the constructor of this class and trigger the addition of a new issue from within this component. But we don’t have the `createIssue()` method available here. Fortunately, since a parent component can pass information down to a child component, we’ll pass the method itself as part of the props to IssueAdd from IssueList, so that it can be called from IssueAdd

```js
...
  <IssueAdd createIssue={this.createIssue} />
...
```

This lets us make a call to `createIssue()` from IssueAdd using `this.props.createIssue()` as part of the timer callback. So let’s create a constructor in IssueAdd and move the timer set up with a minor change to use the createIssue callback passed in via props like this

<pre>
...
  setTimeout(() => {
    this.<b>props</b>.createIssue(sampleIssue);
  }, 2000);
...
</pre>

`<i>this</i>` within the callback will refer to whatever this was in the lexical scope, that is, outside of the anonymous function, where the code is present.
That worked as long as the called function was within the same class as the timer callback. It still works, in the `loadData()` method, because this refers to the IssueList component where the timer was fired, and therefore, <i>this.state</i> refers to the state within IssueList itself. But, when createIssue is called from a timer within IssueAdd, this will refer to the IssueAdd component. But what we really want is for createIssue to be always called with this referring to the IssueList component. Otherwise, this.state.issues will be undefined.

The way to make this work is to bind the method to the IssueList component before passing it around.

```js
...
  <IssueAdd createIssue={this.createIssue.bind(this) />
...
```

But then, if we need to ever refer to the same method again and pass it to some other child component, we’d have to repeat this code. Also, there is never going to be a case where we will need the method to be not bound, so it is best to replace the definition of createIssue with a bound version of itself. The recommended way to do this is in the constructor of the class where this method is implemented.

So, instead of binding during the instantiation of IssueAdd, let’s bind it in the constructor of IssueList

```js
...
this.createIssue = this.createIssue.bind(this);
...
```

The effect of these changes will not be seen in the user interface. The application will behave as it used to. On refreshing the browser, you will see an empty table to start with, which will soon be populated with two issues and after two seconds, another issue will be added.

![expected-output](./resources/expected-output.JPG)
