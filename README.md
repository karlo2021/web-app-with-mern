# NodeJs

## configure project

`npm init`

## install express locally 

`npm install express`

or specific version 

`npm install express@4`

## install Babel library & CLI(command-line interface) locally 

`npm install --save-dev @babel/core@7 @babel/cli@7`

## install Babel globally (optional, locally prefered)

`npm install --global --save-dev  @babel/cli`

## check install verion of Babel

`node_modules/.bin/babel --version`

## for transform JSX syntax into regular JavaScript

`npm install --save-dev @babel/preset-react@7`

## transform App.jsx into pure JavaScript

`npx babel src --presets @babel/react --out-dir public`

## start your application

`npm start`

## open browser, paste one of following links

```
http://localhost:3000
http://localhost:3000/index.html
localhost:3000
```