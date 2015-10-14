In my time working with Falcor and hapi via Node.JS (ES5) and React using JSX Harmony (ES6) it is clear that massive improvements have been made to JavaScript via ES6. I would seem to me that ES6 brings much needed updates to JavaScript in the sense of readability for developers coming from another language to JavaScript; the stricter one adheres to the new ES6 standards the quicker a new developer could be integrated in to an existing codebase. Currently with ES5 conventions a lot of time could be wasted when integrating a new developer due to the hacky methods by which very simple tasks, such as setting a default value for a function parameter, are accomplished.
#### ES5
```
Function es5Example (arg1, optionalArg) {
// Set default for optionalArg to Hello.
(optionalArg === undefined) && (optionalArg = 'Hello');
// This will not make any sense to anyone who is not a master of JS.
```
#### ES6
```
Function es6Example (arg1, optionalArg = 'Hello') {
// This follows standard conventions of other modern languages making it
// instantly obvious to a new developer what is happening.
```
In working on the client side there were some inconsistencies between the ES5 syntax for an anonymous function versus the ES6 syntax for an anonymous function and the subtle differences may not be immediately obvious to a developer coming onboard that is less familiar with JS. One who is new to JS, but not new to development in general, might see both styles passed as a function argument and could potentially use them interchangeably; until one day they use the ES5 style and then try to call 'this' to learn it is undefined with no clear explanation as to why.
#### ES5 Anonymous functions
```
// there is a make believe class here...I swear
hollaback(function (holla) {
this.hearResponse(holla); //'this' is undefined
}
```
#### ES6 "Arrow Functions"
```
// there is a make believe class here...I swear
hollaback((holla) => {
this.hearResponse(holla); //'this' correctly referres to the enclosing class.
}
```
We should enforce, through linting if possible, any standard that improves readability thus reducing the time to integrate for a new developer. If supported in the current context ES6 style default parameter values should always be used in favor of the esoteric ES5 and earlier solutions. ES6 Arrow functions should always be used in favor of ES5 anonymous functions for callbacks as a matter of good habit even when there is no 'this' context to maintain.
