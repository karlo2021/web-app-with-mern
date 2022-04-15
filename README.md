# Create API Integration

Let’s start the integration of the Create API with a minor change in the defaulting of the new issue in the UI. Let’s remove setting the status to 'New' and set the due date to 10 days from the current date. This change can be done in the handleSubmit() method in the IssueAdd

<pre>
...
const issue = {
  owner: form.owner.value, title: form.title.value, <del>status: 'New'</del>,
  <b>due: new Date(new Date().getTime() + 1000*60*60*24*10)</b>
};
...
</pre>


  
