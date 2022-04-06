# NodeJs

## JSX Transform

  Create a new directory to keep all the JSX files, which will be transformed into plain JavaScript and into the public folder. Call this directory src and move <b>App.jsx</b> into this directory.
For the transformation, we'll need to install some Babel tools. We need the core Babel library and a command-line interface (CLI) to do the transform.

`npm install --save-dev @babel/core@7 @babel/cli@7`

Check the version that is installed using the --version option. Since it is not a global install, Babel will not be available in the path. We have to specifically invoke it from its installed location like this:

`node_modules/.bin/babel --version`

  We could have installed @babel/cli globally using the `--global (or –g)` option of npm. That way, we would have had access to the command in any directory, without having to prefix the path. But as discussed earlier, it's good practice to keep all installations local to a project. This is so that we don't have to deal with
version differences of a package across projects

the latest version of npm gives us a convenient command called npx, which resolves the correct local path of any executable. This command is available
only in npm version 6 onwards. Use this command to check the Babel version

`npx babel --version`

To transform JSX syntax into regular JavaScript, we need a preset

`npm install --save-dev @babel/preset-react@7`

Now we're ready to transform App.jsx into pure JavaScript. The babel command-line takes an input directory with the source files and the presets that are applicable and the output directory as options

`npx babel src --presets @babel/react --out-dir public`

If you look at the output directory public, you will see that there is a new file called App.js in there. If you open the file in your editor, you can see that the JSX elements have been converted to React.createElement() calls.

Now, we will need to change the reference in index.html to reflect the new extension and remove the script type specification since it is pure JavaScript. Further, we'll no longer need the runtime transformer to be loaded in index.html, so we can get rid of the babel-core script library specification. 

<pre>
...
 <del><script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script><del>
...
 <body>
 <div id="contents"></div
 <del><script src="/App.jsx" type="text/babel"></script></del>
 <script src="/App.js"></script>
 </body>
...
</pre>

