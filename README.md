# NodeJs

## custom commands

Apart from being able to start the project using npm start, npm has the ability to define other custom commands. This is especially useful when there are many command line parameters for the command.
<br />
 > These custom commands can be specified in the scripts section of package.json <br />
 > Then be run using npm run <script> from the console

 - Add a script called compile whose command line is the Babel command line to do all transforms

```js
...
 "compile": "babel src --out-dir public",
...
```
We don’t need the npx prefix because npm automatically figures out the location of commands
that are part of any locally installed packages.

 - Run transform command
`npm run compile`
 <br />
 After this, if you run npm start again to start the server, you can see any changes to App.jsx reflected in
the application.

 <br />
 When we work on the client-side code and change the source files frequently, we have to manually
recompile it for every change. Wouldn’t it be nice if someone could detect these changes for us and
recompile the source into JavaScript? Babel supports this out of the box via the --watch option.

 > Add another script called **watch** with this additional option to the Babel command line:

```js
...
 "wathc": "babel src --out-dir public --watch --verbose"
...
```

It is essentially the same command as compile, but with two extra command line options, --watch and
--verbose.
 > **--watch** option instructs Babel to watch for changes in source files
 > **--verbose** causes it to print out line in the console whenever a change causes a recompilation

 A similar restart on changes to the server code can be affected by using a wrapper command called
nodemon. This command restarts Node.js with the command specified whenever there is a change in a set of files. <br />
**Forever** is another package that can be used to achieve the same goal. Typically, forever is used to restart the server on crashes rather than watch for changes to files. <br />
The best practice is to use nodemon during development (where watching for changes is the real need) and forever on production (where restarting on crashes is the need)

 > install nodemon

`npm install nodemon@2`

 let’s use nodemon to start the server instead of Node.js in the script specification for start in
package.json. The command nodemon also needs an option to indicate which files or directory to watch
changes for using the -w option. Since all the server files are going to be in the directory called server, we can use **-w server** to make nodemon restart Node.js when any file in that directory changes. <br />
 > new command for the start script within package.json will now be
 ```js
 ...
 "start": "nodemon -w server server/server.js"
 ...
 ```

  > The final set of scripts added or changed in package.json 
```js
<pre>
...
 "scripts": {
 <del>"start": "node server/server.js",</del>
 <mark style="background-color: #FFFF00">"start": "nodemon -w server server/server.js"</mark>
 <mark style="background-color: #FFFF00">"compile": "babel src --out-dir public"</mark>,
 <mark style="background-color: #FFFF00">"watch": "babel src --out-dir public --watch --verbose"</mark>,
 "test": "echo \"Error: no test specified\" && exit 1"
 },
...
</pre>
 ```
<br />
 If you now run the new command using <b>npm run watch</b>, you will notice that it does one transform, but  it doesn’t return to the shell. It’s actually waiting in a permanent loop, watching for changes to the source files.
 So, to run the server, another terminal is needed, where npm start can be executed. 
 If you make make a small change to App.jsx and save the file, you’ll see that App.js in the public
 directory is regenerated. And, when you refresh the browser, you can see those changes without having to manually recompile. You can also make any changes to server.js and see that the server starts, with a message on the console that says the server is being restarted
