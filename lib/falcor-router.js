var $ref = require('falcor').Model.ref;
var Router = require('falcor-router');
var _ = require('lodash');
var PouchDB = require('pouchdb');
var db = new PouchDB('data/user');
var officeDb = new PouchDB('data/company');
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-quick-search'));

var inRange = function (ranges) {
  return function (i) {
    return _.some(ranges, function (range) {
      return i >= range.from && i <= range.to;
    });
  };
};

var UsersRouter = Router.createClass([
  {
    route: 'users[{ranges:indexRanges}]',
    get: function (pathSet) {
      var rangeChecker = function (user, i) {
        return inRange(pathSet.indexRanges)(i);
      };
      return db.allDocs({include_docs: true})
          .then(function (res) {
            var jsonGraph = _(res.rows)
                .map(function (user, i) {
                  //console.log(user, i);
                  return {
                    path: ['users', i],
                    value: $ref(['usersById', user.doc.uid])
                  };
                })
                .filter(rangeChecker)
                .value();
            console.log(JSON.stringify(jsonGraph, null, 2));
            console.log("returning from users[{ranges:indexRanges}]");
            return jsonGraph;
          }, function (err) {
            // TODO figure out sane error handling
            console.log(err);
          });
    }
  },
  {
    route: 'usersByName[{keys:users}]',
    set: function (jsonGraphArg) {
      //TODO: Test.
      var usersByName = jsonGraphArg.usersByName,
          _users = Object.keys(usersByName);
      return _users.map(function(user) {
        return db.search({
          query: user,
          fields: ['name'],
          include_docs: true
        }).then(function (searchResults) {
          console.log(JSON.stringify(searchResults, null, 2));
          if (searchResults.totalRows < 1) {
            console.log("no records found.");
            //This should be creating a new record if that is the desired functionality.
            return {
              path: ['usersByName', user],
              value: "not found"
            };
          }
          if (searchResults.totalRows > 1) {
            console.log("too many records found.");
            return {
              path: ['usersByName', user],
              value: "Multiple users found"
            };
          }
          //update doc with all values provided.
          return db.bulkDocs({
            _id: searchResults.rows[0].value.id,
            _rev: searchResults.rows[0].value.rev,
            uid: user.uid ? user.uid : searchResults.rows[0].uid,
            is_enabled: user.is_enabled ? user.is_enabled : searchResults.rows[0].is_enabled,
            name: user.name ? user.name : searchResults.rows[0].name,
            company: user.company ? user.company : searchResults.rows[0].company,
            email: user.email ? user.email : searchResults.rows[0].email,
            phone: user.phone ? user.phone : searchResults.rows[0].phone,
            office: user.office ? user.office : searchResults.rows[0].office
          }).then(function(updateResults) {
            console.log("update results:");
            console.log(JSON.stringify(updateResults, null, 2));
            return {
              path: ['usersByName', user],
              value: "Record updated"
            };
          });
        });
      });
    }
  },
  {
    route: 'users.length',
    get: function (pathSet) {
      return db.allDocs().then(function (response) {
        console.log("returning users.length = " + response.total_rows - 1);
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
      /*var rangeChecker = function (user, i) {
        return inRange(pathSet.indexRanges)(i);
      };*/
      console.log("Ascending sort.");
      var rangeLimit;
      _.some(pathSet.indexRanges, function (range) {
        rangeLimit = (range.to - range.from) + 1;
      });
      console.log(pathSet.indexRanges);
      console.log(rangeLimit);
      //sort pouchDB results
      return db.createIndex({
        index: {
          fields: ['name']
        }
      }).then(function () {
        return db.find({
          selector: {
            name: {$exists: true}
          },
          limit: rangeLimit,
          sort: [{name: 'asc'}]
        }).then(function (res) {
          console.log(res.docs);
          var jsonGraph = _(res.docs)
              .map(function (user, i) {
                if (user == undefined) {
                  return {
                    path: ['usersAscendingSort', i],
                    value: null
                  };
                }
                else {
                  return {
                    path: ['usersAscendingSort', i],
                    value: $ref(['usersById', user.uid])
                  };
                }
              }).value();
          console.log(JSON.stringify(jsonGraph, null, 2));
          console.log("Returning from usersAscendingSort.");
          return jsonGraph;
        }, function (err) {
          // TODO figure out sane error handling
          console.log(err);
        });
      });
    }
  },
  {
    route: 'usersDescendingSort[{ranges:indexRanges}]',
    get: function (pathSet) {
      /*var rangeChecker = function (user, i) {
       return inRange(pathSet.indexRanges)(i);
       };*/
      console.log("Descending sort.");
      var rangeLimit;
      _.some(pathSet.indexRanges, function (range) {
        rangeLimit = (range.to - range.from) + 1;
      });
      console.log(pathSet.indexRanges);
      console.log(rangeLimit);
      //sort pouchDB results
      return db.createIndex({
        index: {
          fields: ['name']
        }
      }).then(function () {
        return db.find({
          selector: {
            name: {$exists: true}
          },
          limit: rangeLimit,
          sort: [{name: 'desc'}]
        }).then(function (res) {
          console.log(res.docs);
          var jsonGraph = _(res.docs)
              .map(function (user, i) {
                if (user == undefined) {
                  return {
                      path: ['usersDescendingSort', i],
                      value: null
                    };
                }
                else {
                  return {
                    path: ['usersDescendingSort', i],
                    value: $ref(['usersById', user.uid])
                  };
                }
              }).value();
          console.log(JSON.stringify(jsonGraph, null, 2));
          console.log("Returning from usersDescendingSort.");
          return jsonGraph;
        }, function (err) {
          // TODO figure out sane error handling
          console.log(err);
        });
      });
    }
  },
  {
    route: 'usersById[{keys:ids}]["uid","is_enabled","name","company","email","phone","office"]',
    get: function (pathSet) {
      var fields = pathSet[2];
      return db.allDocs({include_docs: true})
          .then(function (res) {
            return _(pathSet.ids)
                .map(function (id) {
                  var user = _.find(res.rows, {doc: {uid: id}});
                  if (user == undefined) {
                    return _.map(fields, function (field) {
                      return {path: ['usersById', id, field], value: null};
                    });
                  }
                  else {
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
      console.log("entered offices route");
      return officeDb.allDocs({include_docs: true})
          .then(function (response) {
            console.log(response);
            return _(pathSet.names)
                .map(function (name) {
                  var office = _.find(response.rows, {doc: {office: name}});
                  if (office == undefined) {
                    return _.map(fields, function (field) {
                      return {path: ['offices', name, field], value: null};
                    });
                  }
                  else {
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
