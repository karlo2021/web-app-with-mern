
## Seperate script file

In all the previous sections, the transformation of JSX to JavaScript happens at runtime. This is inefficient and quite unnecessary. Let’s instead move the transformation to the build stage in our development. As the first step, we need to separate out the JSX and JavaScript from the all-in-one index.html and
refer to it as an external script. This way, we can keep the HTML as pure HTML and all the script that needs compilation in a separate file.
<br />
Call this external script App.jsx and place it in the public directory, so that it can be referred to as /App.jsx from the browser. Replace the inline script with a reference to an external source like this:


```js
  ...
  <script type="text/babael" src="App.jsx></script>
  ...
```

Note that the script type text/babel continues to be needed, since the JSX compilation happens in the browser using the Babel library.
Point your browser to [localhoost:3000](http://localhost:3000), you should see the same Hello World message. But we have only separated the files; we
have not moved the transform to build time. 

