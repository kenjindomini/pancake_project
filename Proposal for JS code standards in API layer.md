In my time working with Falcor and hapi via Node.JS (ES5) and React using JSX Harmony (ES6) it is clear that massive improvements have been made to JavaScript vis ES6. I would seem to me that ES6 brings much needs updates to JavaScript in the sense of readability for developers coming from another language to JavaScript; the stricter one adheres to the new ES6 standards the quicker a new developer could be integrated in to an existing codebase. Currently with ES5 conventions a lot of time could be wasted when integrating a new developer due to the hacky methods by which very simple tasks, such as setting a default value for a function parameter, are accomplished.
#### ES5
```
Function es5Example (arg1, optionalArg) {
// set default for optionalArg to Hello.
(optionalArg === undefined) && (optionalArg = 'Hello');
// This will not make any sense to anyone who is not a master of JS.
```
#### ES6
```
Function es6Example (arg1, optionalArg = 'Hello') {
// This follows standard conventions of other modern languages making it
// instantly obvious to a new developer what is happening.
```

* speak to the inconsistency of ES5 and ES6 style anonymous functions
    * expand by stating that only the ES6 style should ever be used in an ES6 project since 'this' becomes undefined using the ES5 style.