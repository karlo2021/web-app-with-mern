# NodeJs

## Passing data using children

There is another way to pass data to other components, using the contents of the HTML-like node of the component. In the child component, this can be accessed using a special field of this.props called this.props.children.
Just like in regular HTML, React components can be nested. In such cases, the JSX expression will need to include both the opening and closing tags, with child elements nested in them.
When the parent React component renders, the children are not automatically under it. React lets the parent component access the children element using this.props.children and lets the parent component determine where it needs to be displayed.

 > wrapper `<div>` that adds a border and a padding can be defined like this:

```js
class BorderWrap extends React.Component{
  render(){
    const borderStyle = {border: "1px solid silver", padding: 6};
    return(
      <div style={borderStyle}>
        {this.props.children}
      </div>
    );
  }
}
```

 > Then, during the rendering, any component could be wrapped with a padded border like this:

```
...
  <BorderWrap>
    <ExampleComponent />
  </BorderWrap>
...
```

Thus, instead of passing the issue title as a property to IssueRow, this technique could be used to embed it as the child contents of `<IssueRow>` like this:

```
...
  <IssueRow issue_id={1}>Error in console when clicking add!</IssueRow>
...
```

Now, within the render() method of IssueRow, instead of referring to this.props.issue_title, it will
need to be referred to as this.props.children, like this:

```html
...
  <td style={borderStyle}>{this.prop.children}</td>
...
```

 - App.jsx: Using Children Instead of Props

```js
...
class IssueRow extends React.Component{
  ...
    return(
      <tr>
        <td style={style}>{this.props.issue_id}</td>
        <del><td style={style}>{this.props.issue_title}</td></del>
        <b><td style={style}>{this.props.children}</td></b>
      </tr>
    );
  ...
}
...
...
class IssueTable extends React.Component{
  ...
    ...
      <tbody>
        <IssueRow rowStyle={rowStyle} issue_id={1}
          issue_title="Error when clicking add" />
        <IssueRow rowStyle={rowStyle} issue_id={2}
          issue_title="Missing bottom border on panel" />
        <IssueRow rowStyle={rowStyle} issue_id={1}>
          Error in console when clicking Add
        </IssueRow>
        <IssueRow rowStyle={rowStyle} issue_id={2}>
          Missing bottom border on panel
        </IssueRow>
      </tbody>
    ...
}
```
