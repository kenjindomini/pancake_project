var $ref = require('falcor').Model.ref;
var Router = require('falcor-router');
var _ = require('lodash');
var PouchDB = require('pouchdb');
var db = new PouchDB('data/user');
var officeDb = new PouchDB('data/company');
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-quick-search'));

// Get the users from PouchDB in the range specified, the whole database is sorted in the direction specified.
function getSortedUsers (range, sortDirection) {
  var p = new Promise(function (resolve, reject) {
    var rangeLimit;
    _.some(range, function (_range) {
      range = _range;
      // fail call if range is not valid.
      if (_range.to === undefined || _range.from === undefined) {
        reject('Invalid range.');
      }
      // set range limit to 1 more than range ceiling to ensure the correct number of docs are returned.
      rangeLimit = _range.to + 1;
    });
    // set default for sortDirection to ascending.
    (sortDirection === undefined) && (sortDirection = 'asc');
    // fail call if sort direction is neither ascending or descending.
    if (sortDirection !== 'asc' && sortDirection !== 'desc') {
      reject('Invalid sort direction specified. only valid options are "asc" and "desc".');
    }
    // sort pouchDB results
    db.createIndex({
      index: {
        fields: ['name']
      }
    }).then(function () {
      var results = db.find({
        selector: {
          name: {$exists: true}
        },
        limit: rangeLimit,
        skip: range.from,
        sort: [{name: sortDirection}]
      });
      resolve(results);
    });
  });
  return p;
}

var UsersRouter = Router.createClass([
  {
    route: 'users[{ranges:indexRanges}]',
    get: function (pathSet) {
      console.log('entering get(users).');
      var rangeLimit = 0;
      var range = pathSet.indexRanges;
      _.some(range, function (_range) {
        range = _range;
        // set range limit to 1 more than range ceiling to ensure the correct number of docs are returned.
        rangeLimit = _range.to + 1;
      });
      return db.find({
        selector: {
          name: {$exists: true}
        },
        limit: rangeLimit,
        skip: range.from
      }).then(function (res) {
        var jsonGraph = _(res.rows)
            .map(function (user, i) {
              return {
                path: ['users', i],
                value: $ref(['usersById', user.doc.uid])
              };
            })
            .value();
        console.log(JSON.stringify(jsonGraph, null, 2));
        console.log('returning from users[{ranges:indexRanges}]');
        return jsonGraph;
      }, function (err) {
        // TODO figure out sane error handling
        console.log(err);
      });
    }
  },
  {
    route: 'usersByName[{keys:users}]["is_enabled","name","company","email","phone","office"]',
    set: function (jsonGraphArg) {
      // TODO: Test.
      console.log('entering usersByName.set.');
      console.log(JSON.stringify(jsonGraphArg, null, 2));
      var usersByName = jsonGraphArg.usersByName;
      var _users = Object.keys(usersByName);
      return _users.map(function (user) {
        return db.search({
          query: user,
          fields: ['name'],
          include_docs: true
        }).then(function (searchResults) {
          if (searchResults.totalRows < 1) {
            console.log('no records found.');
            // TODO: This should be creating a new record if that is the desired functionality.
            return {
              path: ['usersByName', user],
              value: 'not found'
            };
          }
          if (searchResults.totalRows > 1) {
            console.log('too many records found.');
            return {
              path: ['usersByName', user],
              value: 'Multiple users found'
            };
          }
          console.log('single record found. Attempting to update...');
          console.log('usersByName[' + user + ']:' + JSON.stringify(usersByName[user], null, 2));
          // update doc with all values provided.
          return db.bulkDocs({
            _id: searchResults.rows[0].value.id,
            _rev: searchResults.rows[0].value.rev,
            is_enabled: usersByName[user].is_enabled ? usersByName[user].is_enabled : searchResults.rows[0].is_enabled,
            name: usersByName[user].name ? usersByName[user].name : searchResults.rows[0].name,
            company: usersByName[user].usersByName[user] ? user.company : searchResults.rows[0].company,
            email: usersByName[user].email ? usersByName[user].email : searchResults.rows[0].email,
            phone: usersByName[user].phone ? usersByName[user].phone : searchResults.rows[0].phone,
            office: usersByName[user].office ? usersByName[user].office : searchResults.rows[0].office
          }).then(function (updateResults) {
            console.log('update results:');
            console.log(JSON.stringify(updateResults, null, 2));
            return {
              path: ['usersByName', user],
              value: 'Record updated'
            };
          });
        });
      });
    }
  },
  {
    route: 'users.length',
    get: function () {
      console.log('entering users.length.get');
      return db.allDocs().then(function (response) {
        console.log('returning users.length = ' + response.total_rows - 1);
        var jsonGraph = [{
          path: ['users', 'length'],
          value: response.total_rows - 1
        }];
        console.log(JSON.stringify(jsonGraph, null, 2));
        return jsonGraph;
      });
    }
  },
  {
    route: 'usersAscendingSort[{ranges:indexRanges}]',
    get: function (pathSet) {
      console.log('Ascending sort.');
      var indexOffset = 0;
      _.some(pathSet.indexRanges, function (range) {
        indexOffset = range.from;
      });
      return getSortedUsers(pathSet.indexRanges, 'asc').then(function (res) {
        var jsonGraph = _(res.docs)
            .map(function (user, i) {
              var index = i + indexOffset;
              return {
                path: ['usersAscendingSort', index],
                value: $ref(['usersById', user.uid])
              };
            }).value();
        console.log('Returning from usersAscendingSort.');
        return jsonGraph;
      }, function (err) {
        // TODO figure out sane error handling
        console.log(err);
      });
    }
  },
  {
    route: 'usersDescendingSort[{ranges:indexRanges}]',
    get: function (pathSet) {
      console.log('Descending sort.');
      var indexOffset = 0;
      _.some(pathSet.indexRanges, function (range) {
        indexOffset = range.from;
      });
      return getSortedUsers(pathSet.indexRanges, 'desc').then(function (res) {
        console.log(res.docs);
        var jsonGraph = _(res.docs)
            .map(function (user, i) {
              var index = i + indexOffset;
              return {
                path: ['usersDescendingSort', index],
                value: $ref(['usersById', user.uid])
              };
            }).value();
        console.log(JSON.stringify(jsonGraph, null, 2));
        console.log('Returning from usersDescendingSort.');
        return jsonGraph;
      }, function (err) {
        // TODO figure out sane error handling
        console.log(err);
      });
    }
  },
  {
    route: 'usersById[{keys:ids}]["uid","is_enabled","name","company","email","phone","office"]',
    get: function (pathSet) {
      console.log('entering usersById.get');
      var fields = pathSet[2];
      return db.allDocs({include_docs: true})
          .then(function (res) {
            return _(pathSet.ids)
                .map(function (id) {
                  var user = _.find(res.rows, {doc: {uid: id}});
                  if (user === undefined) {
                    return _.map(fields, function (field) {
                      return {path: ['usersById', id, field], value: null};
                    });
                  } else {
                    return _.map(fields, function (field) {
                      // TODO consider missing field support more closely
                      return {path: ['usersById', id, field], value: user.doc[field]};
                    });
                  }
                })
                .flatten()
                .value();
          }, function (err) {
            // TODO figure out sane error handling
            console.log(err);
          });
    }
  },
  {
    route: 'offices[{keys:names}]["office","address"]',
    get: function (pathSet) {
      var fields = pathSet[2];
      console.log('entered offices route');
      return officeDb.allDocs({include_docs: true})
          .then(function (response) {
            console.log(response);
            return _(pathSet.names)
                .map(function (name) {
                  var office = _.find(response.rows, {doc: {office: name}});
                  if (office === undefined) {
                    return _.map(fields, function (field) {
                      return {path: ['offices', name, field], value: null};
                    });
                  } else {
                    return _.map(fields, function (field) {
                      return {path: ['offices', name, field], value: office.doc[field]};
                    });
                  }
                })
                .flatten()
                .value();
          }, function (err) {
            // TODO figure out sane error handling
            console.log(err);
          });
    }
  }
]);

module.exports = UsersRouter;
