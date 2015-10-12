## Candidate Project
Welcome to Yieldbot! Here is a working example project we'd like to see you
work with to show some of your work changing around this codebase.

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/solenoid/pancake_project)

### Implementation
* Modified users route to limit DB query to to just the requested range, rather than wasting cycles retrieving the whole database and filtering down.
* Added two routes to retrieve users in a range pre-sorted by name; usersAscendingSort and usersDescendingSort.
    * It may be possible to reduce creating 2 routes for each column you might want to sort by using a call route instead of get. (Researching)
* Implemented and expandable function getSortedUsers to index and sort the database then pulling out just the rows in the requested range.
* Added route users.length to get the current number of rows in the DB.
* Modified usersById to handle users that are not found by filling in all fields with a null value.
* Added route offices to retrieve the office address of the specified office names.
* set(usersByName) route added but complications have been encountered getting it work as expected:
    * Falcor magic automatically does an ascending sort to the incoming JSON which in and of itself is not an issue but if you pass:
    ```
    {
        json: {
            usersByName: {
                'Aimee Farmer': {
                    is_enabled: true,
                    name: 'Aimee Farmer',
                    company: 'TELLIFLY',
                    email: 'aimeefarmer@tellifly.com',
                    phone: '(823) 547-2743',
                    office: 'Portland'
                }
            }
        }
    }
    ```
    only the user's company comes through and if you remove the company only their email comes through, etc.
    * Currently bulkDocs is not updating the database even when a new value is coming through, correcting the code to update the database has been put on the backburner since all expected data is not even getting to the route.

### Requirements
node and npm minimally, but figure out precisely how best to say this.
This is in the process of being reduced to vagrant and virtualbox.

### Setup
```
npm install       # get dev and app dependencies
npm run build-dev # first time setup for local development
npm start         # run webpack dev server and thin backend server
This is in the process of being reduced to:
vagrant up
```

### ES6 Cheatsheet
In case the newer syntax is throwing you for a loop.

https://github.com/addyosmani/es6-equivalents-in-es5

#### Imports / Exports specifically
Because it can be a little odd until understood.

http://www.2ality.com/2014/09/es6-modules-final.html
