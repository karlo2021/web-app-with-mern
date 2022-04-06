## JSX

Imagine writing a deeply nested hierarchy of elements and components using React.createElement() calls: it can get pretty complex.
Also, the actual DOM can’t be easily visualized when using the function calls. To address this, React has a markup language called JSX, which stands for <b>JavaScript XML</b>.

JSX looks very much like HTML, but there are some differences. So, instead of the React.createElement() calls, JSX can be used to construct an element hierarchy and make it look very much like HTML

```js
...
 const element = (
  <div title="Outer div">
    <h1>Hello World!</h1>
  </div>
 );
...
```

Note also that the markup is not enclosed within quotes, so it is not a string that can be used as an innerHTML. But browsers’ JavaScript engines don’t understand JSX. It has to be transformed into regular JavaScript based `React.createElement()` calls. The compiler that does this (and can do a lot more, in fact) is <b>Babel</b>. We should ideally pre-compile the code and inject it into the browser.

For prototyping purposes, Babel provides a standalone compiler that can be used in the browser. Let’s include this script within the `<head>` section of
index.html like this:

```js
...
 <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
...
```

But the compiler also needs to be told which scripts have to be transformed. It looks for the attribute <b>type="text/babel"</b> in all scripts and transforms and runs any script with this attribute

```js
...
 <script type="text/babel">
...
```
