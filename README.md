# Server less Hello World

Let’s write a simple piece of code in a single HTML file that uses React to display a simple page on the browser.

Let’s start creating this HTML file and call it index.html.

React library is available as a JavaScript file that we can include in the HTML file using the `<script>` tag.
It comes in two parts: the first is the <b>React</b> core module, the one that is responsible for dealing with React components, their state manipulation, etc. The second is the <b>ReactDOM</b> module, which deals with converting React components to a DOM that a browser can understand.

These two libraries can be found in unpkg, a Content Delivery Network (CDN) that makes all open-source JavaScript libraries available online. 

[React](https://unpkg.com/react@16/umd/react.development.js) <br/>
[ReactDOM](https://unpkg.com/react-dom@16/umd/react-dom.development.js)

These two scripts can be included in the <head> section using <script> tags like this

```js
...
 <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
 <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
...
```
  
Within the body, create a `<div>` that will eventually hold any React elements that we will create. This can be an empty `<div>`, but it needs an ID, say, content, to identify and get a handle in the JavaScript code.

```html
 ...
 <div id="content"></div>
 ...
```
 
To create the React element, the `createElement()` function of the React module needs to be called. This is quite similar to the JavaScript `document.createElement()` function, but has an additional feature that allows nesting of elements. The function takes up to three arguments and its prototype is as follows:
 
 `React.createElement(type, [props], [...children])`
 
The <b>type</b> can be any HTML tag such as the string 'div', or a React component, <b>props</b> is an object containing HTML attributes or custom component properties. The last parameter(s) is zero or more children elements, which again are created using the createElement() function itself.
 
 For the Hello World application, let’s create a very simple nested element—a <div> with a title attribute that contains a heading with the words “Hello World!”, which will go inside a <script> tag within the body:
 
```js
... 
 const element = React.createElement('div', {title: 'Outer div'}, 
   React.createElement('h3', null, 'Hello World');
...
```
 
Note that this is not yet the real DOM, which is in the browser’s memory and that is why it is called a virtual DOM. Each of these React elements needs to be transferred to the real DOM. The ReactDOM does this when the <b>ReactDOM.render()</b> function is called. This function takes in as arguments the element that needs to be rendered and the DOM element that it needs to be placed under.
 
 We have a <div> that we created in the body, which is the target where the new element needs to be placed. We can get the parent's handle by calling <b>document.getElementByID()</b>, as we would have done using regular JavaScript.
 
```js
...
ReactDOM.render(element, document.getElementById('content'));
...
```
 
You can test this file by opening it in a browser
