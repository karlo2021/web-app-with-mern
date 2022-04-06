# Server less Hello World

Let’s write a simple piece of code in a single HTML file that uses React to display a simple page on the browser.

Let’s start creating this HTML file and call it index.html.

React library is available as a JavaScript file that we can include in the HTML file using the `<script>` tag.
It comes in two parts: the first is the <b>React</b> core module, the one that is responsible for dealing with React components, their state manipulation, etc. The second is the <b>ReactDOM</b> module, which deals with converting React components to a DOM that a browser can understand.

These two libraries can be found in unpkg, a Content Delivery Network (CDN) that makes all open-source JavaScript libraries available online. 

[React](https://unpkg.com/react@16/umd/react.development.js)
[ReactDOM](https://unpkg.com/react-dom@16/umd/react-dom.development.js)

These two scripts can be included in the <head> section using <script> tags like this

```js
...
 <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
 <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
...
```
  
Next, within the body, let’s create a `<div>` that will eventually hold any React elements that we will create. This can be an empty `<div>`, but it needs an ID, say, content, to identify and get a handle in the JavaScript code.
  
To create the React element, the `createElement()` function of the React module needs to be called. This is quite similar to the JavaScript `document.createElement()` function, but has an additional feature that allows nesting of elements. The function takes up to three arguments and its prototype is as follows:
