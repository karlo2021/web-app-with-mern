# Event Handling

Let’s now add an issue interactively, on the click of a button rather than use a timer to do this. We’ll create a form with two text inputs and use the values that the user enters in them to add a new issue. An Add button will trigger the addition.

Let’s start by creating the form with two text inputs in the `render()` method of IssueAdd in place of the placeholder div.

```js
  ...
  <form>
    <input title="owner" type=text placehodler="Owner" />
    <input title="title" type=text placehodler="Title" />
    <button>Add</button>
  </form>
  ...
```

Remove the timer that creates an issue from the constructor.

<pre>
...
constructor() {
  super();
  <del>setTimeout(()=>{
    this.props.createIssue( sampleIssue );
    }, 2000);</del>
}
</pre>

At this point, clicking Add will submit the form and fetch the same screen again. That’s not what we want. Firstly, we want it to call createIssue() using the values in the owner and title fields. Secondly, we want to prevent the form from being submitted because we will handle the event ourselves.
