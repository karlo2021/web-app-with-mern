# ESLint

A linter (something that lints) checks for suspicious code that could be bugs. It can also check whether your code adheres to conventions and standards that you want to follow across your team to make the code
predictably readable.
While there are multiple opinions and debates on what is a good standard (tabs vs. spaces, for
example), there has been no debate on whether there needs to be a standard in the first place. For one team or one project, adopting one standard is far more important than adopting the right standard.
ESLint (https://eslint.org) is a very flexible linter that lets you define the rules that you want to
follow. But we need something to start off with and the rule set that has appealed to me the most has been that of Airbnb.
There are two parts to the Airbnb ESLint configuration: the base configuration applies to plain
JavaScript and the regular configuration includes rules for JSX and React as well. In this section, we’ll use ESLint for the back-end code alone, which means we’ll need to install the base configuration only, along with ESLint and other dependencies that the base configuration needs:

```
$ cd api
$ npm install --save-dev eslint@5 eslint-plugin-import@2
$ npm install --save-dev eslint-config-airbnb-base@13
```

ESLint looks for a set of rules in the .eslintrc file, which is a JSON specification. These are not the
definition of rules, instead, a specification of which rules need to be enabled or disabled. Rule sets also can be inherited, which is what we’ll do using the extends property in the configuration. Using a .eslintrc file makes the rules apply to all the files in that directory. For overrides in a single file, rules can be specified within comments in that file, or even just a single line.
Rules in the configuration file are specified under the property rules, which is an object containing
one or more rules, identified by the rule name, and the value being the error level. The error levels are off, warning, and error. For example, to specify that the rule quotes (which checks for single vs. double quotes for strings) should show a warning, this is how the rule needs to be specified:

```js
...
	rules: {
		"quotes": "warning"
	}
...
```

Many rules have options, for example, the rule quotes has an option for whether the quote type to be
enforced is single or double. When specifying these options, the value needs to be an array with the first element as the error level and the second (or more, depending on the rule) is the option. Here’s how the quotes rule can take an option indicating a check for double quotes:

```js
...
	"quotes": ["warning", "double"]
...
```


Let’s start with a basic configuration that only inherits from the Airbnb base configuration, without any
rules. Let’s also be specific about where the code is going to be run using the env property. Since all the backend code is meant only to be run on Node.js (and only on Node.js), this property will have a single entry for node with a value true. Here’s how the .eslintrc file will look at this stage:

```js
{
	"extends": "airbnb-base",
	"env": {
		"node": "true"
	}
}
```

Now, let’s run ESLint on the entire api directory. The command line to do this is as follows:

```
$ cd api
$ npx eslint .
```

Alternatively, you can install a plugin in your editor that shows lint errors in the editor itself. 
For most of the errors, we are just going to change the code to adhere to the suggested standard. But in
a few cases, we will make exceptions to the Airbnb rule. This could be for the entire project or, in some cases, for a specific file or line in a file.

### Stylistic Issues

JavaScript is quite flexible in syntax, so there are many ways to write the same code. The linter rules report some errors so that you use a consistent style throughout the project.

• Indentation: Consistent indentation is expected throughout; this needs no justification.

•	 Keyword spacing: Spaces between a keyword (if, catch, etc.) and opening parenthesis is recommended.

•	 Missing semicolon: There’s a lot of debate on whether semicolons everywhere or semicolons nowhere is better. Let’s go with the Airbnb default, which is to require a semicolon everywhere.

•	 Strings must use single quotes: JavaScript allows both single and double quotes. In order to standardize, it’s better to consistently use one style. Let’s use Airbnb default, single quotes.

•	 Object properties on a new line: Either all properties of an object have to be in one
line, or each property in a new line.

•	 Space after { and before } in objects: This is just for readability; 

•	 Arrow function style: The linter recommends using either parentheses around a single argument and a function body in curly braces, or no parentheses around the argument and a return expression (i.e., not a function body). Let’s make the suggested corrections.

### Best Practices

These rules are related to better ways of doing things, which typically helps you avoid errors.

