# NodeJs

## React Classes

Let’s change the Hello World example from a simple element to use a React class called HelloWorld,
extended from **React.Component** <br />
React classes are used to create real components <br />
These classes can then be reused within other components, handle events, and so much more. <br />
 > React classes are created by extending React.Component
 > Render() method is what React calls when it needs to display the component in the UI
 > render() function returns an element (native HTML element such as a div or an instance of 
 > another React component).

 - Let’s change the Hello World example from a simple element to use a React class
  
```html
  class HelloWorld extends React.Component{
    ...
  }
  ...
```
 > within this class, a render() method is needed, which should return an element

```html
...
render(){
  return (
    <div title='Outer div'>
      <h1>{message}</h1>
    </div>
  );
...
```
 > move all the code for message construction to within the render() function
 > so that it remains encapsulated within the scope where it is needed rather than polluting 
 > global namespace

```
...
render(){
  const continents = ["Africa","America","Asia","Australia","Europe"];
  const helloContinents = Array.from(continents, c => `Hello ${c}!`);
  const message = helloContinents.Join(' ');

  return(
    ...
  );
  ...
```
JSX element is now returned from the render() method of the component class called
Hello World<br />
 > an instance of the HelloWorld class can be created like this:

`const element = <HelloWorld />;`

 > at last render the component
<br />
`ReactDOM.render(element, document.GetElementById('content'));`

By now you should be running npm run watch in a console and have started the server using npm start in a separate console. Thus, any changes to App.jsx should have been automatically compiled.

