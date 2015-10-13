# Falcor vs GraphQL+Relay
## Falcor Pros
* Very simple syntax for client side
    * Calls emulate JSON path syntax
* Intelligent caching with the ability to set an expiration of a value when you make the call to retrieve it.
* Auto-magically converts you call in to the most efficient call.
    * Example: Calling users[0..15]["name", "uid"] returns $refs to usersByID so falcor will convert calls to usersByID for subsequent calls for the same data.

## Falcor Cons
* There is a lot of magic inside the blackbox that is Falcor
    * Auto sorting the jsonGraphEnvelope
* Severe lack of documentation and meaningful examples
* Small community

## GraphQL + Relay Pros
* Maturity
    * Larger community
    * More/Better documentation
* Part of the React familiy
    * May be easier to pick up for those already familiar with React

## GraphQL + Relay Cons
* More complex Query Language style calls with inline functions
