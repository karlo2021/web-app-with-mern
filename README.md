# NodeJs

## custom commands

Apart from being able to start the project using npm start, npm has the ability to define other custom commands. This is especially useful when there are many command line parameters for the command.
<br />
 > These custom commands can be specified in the scripts section of package.json
 > Then be run using npm run <script> from the console

 - Add a script called compile whose command line is the Babel command line to do all transforms

```
...
 "compile": "babel src --out-dir public",
...
```
We don’t need the npx prefix because npm automatically figures out the location of commands
that are part of any locally installed packages.

 - Run transform command
 <br />
 `npm run compile`
 <br />
 After this, if you run npm start again to start the server

 <br />
 When we work on the client-side code and change the source files frequently, we have to manually
recompile it for every change. Wouldn’t it be nice if someone could detect these changes for us and
recompile the source into JavaScript? Babel supports this out of the box via the --watch option.

 > Add another script called **watch** with this additional option to the Babel command line:

```
...
 "wathc": "babel src --out-dir public --watch --verbose"
...
```
< b/>
It is essentially the same command as compile, but with two extra command line options, --watch and
--verbose.
 > **--watch** option instructs Babel to watch for changes in source files
 > **--verbose** causes it to print out line in the console whenever a change causes a recompilation

 A similar restart on changes to the server code can be affected by using a wrapper command called
nodemon. This command restarts Node.js with the command specified whenever there is a change in a set of files. <b />
**Forever** is another package that can be used to achieve the same goal. Typically, forever is used to restart the server on crashes rather than watch for changes to files. <b />
The best practice is to use nodemon during development (where watching for changes is the real need) and forever on production (where restarting on crashes is the need)

 > install nodemon

 `npm install nodemon@1`

 let’s use nodemon to start the server instead of Node.js in the script specification for start in
package.json. The command nodemon also needs an option to indicate which files or directory to watch
changes for using the -w option. Since all the server files are going to be in the directory called server, we can use **-w server** to make nodemon restart Node.js when any file in that directory changes. <b />
 > new command for the start script within package.json will now be
 ```
 ...
 "start": "nodemon -w server server/server.js"
 ...
 ```

  > The final set of scripts added or changed in package.json 

<pre>
...
 "scripts": {
 <del>"start": "node server/server.js",</del>
 <b>"start": "nodemon -w server server/server.js"</b>
 <b>"compile": "babel src --out-dir public",</b>
 <b>"watch": "babel src --out-dir public --watch --verbose",</b>
 "test": "echo \"Error: no test specified\" && exit 1"
 },
...
</pre>
<b />
 If you now run the new command using <bold>npm run watch</bold>, you will notice that it does one transform, but  it doesn’t return to the shell. It’s actually waiting in a permanent loop, watching for changes to the source files.
 <b />So, to run the server, another terminal is needed, where npm start can be executed.<b />
 If you make make a small change to App.jsx and save the file, you’ll see that App.js in the public
 directory is regenerated. And, when you refresh the browser, you can see those changes without having to manually recompile. You can also make any changes to server.js and see that the server starts, with a message on the console that says the server is being restarted