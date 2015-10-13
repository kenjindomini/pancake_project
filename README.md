## Candidate Project
Welcome to Yieldbot! Here is a working example project we'd like to see you
work with to show some of your work changing around this codebase.

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/solenoid/pancake_project)

### Implementation
#### Infrastructure
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

#### Frontend
* Added buttons to test functionality of 4 routes get(users), get(usersAscendingSort), get(usersDescendingSort), get(offices)
    * get(offices) currently just outputs the stringified JSON as a method has not yet been added to display the data in a meaningful way
* Added pagination support.
    * Currently restricted to ascending or descending sort of the name column while a sustainable solution is being researched for the API layer.
* All calls were broken out in to individual functions so that the site would not need to be recompiled in order to test each API call.
* Added a single call to handle getting sorted users, it determines if we are ascending or descending and calls the correct function.

### WIP
* Adding a call route "sortedUsers" that will allow granular control over which column the client wants the data presorted by.
    * This is currently in a state of built but regardless of the setup we either get back an HTTP 500 or an empty jsonGraph.
* Adding a set route "usersByName" that will allow the client side to update records and could easily be expanded to add new records.
    * This is currently about 90% complete with calls coming in but each user only has 1 key value pair and assuming this wasn't a problem the update DB code is not updating the DB
    * If we could get call routes working this might be a prime candidate for converting to a function.
* Building a working vagrantfile that will still allow the site to be reached from the host machine.
* Testing version of node prior to 4.1.1 via NVM.

### Setup
#### Vagrant(automated)
##### Requirements
* Vagrant
* Virtualbox
* git
* 2 cpu (cores) and 2GBs of RAM to dedicate to the vagrant VM.

```
git clone https://github.com/kenjindomini/pancake_project.git ~/pancake_project     # If on windows be sure to use powershell which supports some *nix conventions like ~ and ls
cd ~\pancake_project                                                                # Verify you see project files like README.md if not you will likely see a directory named pancake_project cd in to that as well
vagrant up                                                                          # This will take a few minutes, grab your beverage of choice and/or have a promenade around the lake.
vagrant ssh                                                                         # On windows be sure the full path to Git\usr\bin is in PATH as this will contain ssh.
cd pancake_project                                                                  # Verify you see project files like README.md if not you will likely see a directory named pancake_project cd in to that as well
npm run start
```

#### Local
##### Requirements
* Node + npm
* Python 2.7.2
* git

```
git clone https://github.com/kenjindomini/pancake_project.git ~/pancake_project     # If on windows be sure to use powershell which supports some *nix conventions like ~ and ls
cd ~\pancake_project                                                                # Verify you see project files like README.md if not you will likely see a directory named pancake_project cd in to that as well
npm install                                                                         # get dev and app dependencies
npm run build-dev                                                                   # first time setup for local development (Will not work on windows due to joining commands via &&.)
npm run start                                                                       # run webpack dev server and thin backend server
```

### Testing
Completed features were confirmed working on the following versions of node:
* 4.1.1


### ES6 Cheatsheet
In case the newer syntax is throwing you for a loop.

https://github.com/addyosmani/es6-equivalents-in-es5

#### Imports / Exports specifically
Because it can be a little odd until understood.

http://www.2ality.com/2014/09/es6-modules-final.html
