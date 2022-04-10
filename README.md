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
