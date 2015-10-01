var $ref = require('falcor').Model.ref;
var Router = require('falcor-router');
var _ = require('lodash');
var PouchDB = require('pouchdb');
var db = new PouchDB('data/user');
var sortBy = require('lodash/collection/sortBy');

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
      return db.allDocs({ include_docs: true })
        .then(function (res) {
          return _(res.rows)
            .map(function (user, i) {
              console.log(user, i);
              return {
                path: ['users', i],
                value: $ref(['usersById', user.doc.uid])
              };
            })
            .filter(rangeChecker)
            .value();
        }, function (err) {
          // TODO figure out sane error handling
          console.log(err);
        });
    }
  },
  {
    route: 'users[{ranges:indexRanges}].sortedBy["uid","is_enabled","name","company","email","phone","office"].asc',
    get: function (pathSet) {
      var rangeChecker = function (user, i) {
        return inRange(pathSet.indexRanges)(i);
      };
      return db.allDocs({ include_docs: true })
          .then(function (res) {
            //TODO return users in range sorted by the specified field in ascending order.
            return _(res.rows)
                .map(function (user, i) {
                  console.log(user, i);
                  return {
                    path: ['users', i],
                    value: $ref(['usersById', user.doc.uid])
                  };
                })
                .filter(rangeChecker)
                .value();
          }, function (err) {
            // TODO figure out sane error handling
            console.log(err);
          });
    }
  },
  {
    route: 'users[{ranges:indexRanges}].sortedBy["uid","is_enabled","name","company","email","phone","office"].desc',
    get: function (pathSet) {
      var rangeChecker = function (user, i) {
        return inRange(pathSet.indexRanges)(i);
      };
      return db.allDocs({ include_docs: true })
          .then(function (res) {
            //TODO return users in range sorted by the specified field in descending order.
            return _(res.rows)
                .map(function (user, i) {
                  console.log(user, i);
                  return {
                    path: ['users', i],
                    value: $ref(['usersById', user.doc.uid])
                  };
                })
                .filter(rangeChecker)
                .value();
          }, function (err) {
            // TODO figure out sane error handling
            console.log(err);
          });
    }
    //TODO return users in range sorted by the specified field in descending order.
  },
  {
    route: 'usersById[{keys:ids}]["uid","is_enabled","name","company","email","phone","office"]',
    get: function (pathSet) {
      var fields = pathSet[2];
      return db.allDocs({ include_docs: true })
        .then(function (res) {
          return _(pathSet.ids)
            .map(function (id) {
              var user = _.find(res.rows, { doc: { uid: id } });
              // TODO null the record if the id can't be found
              return _.map(fields, function (field) {
                // TODO consider missing field support more closely
                return { path: ['usersById', id, field], value: user.doc[field] };
              });
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
    route: 'officesByName[{keys:names}]["office","address"]',
    //TODO pull office info for specified names via initial-companies.json.
    get: function (pathSet) {
      var fields = pathSet[2];
      return db.allDocs({ include_docs: true })
          .then(function (response) {
            return (pathSet.names)
              .map(function (name) {
                  var office = _.find(response.rows, { doc: { office: name} });
                  if (user == undefined) {
                    return _.map(fields, function (field) {
                      return { path: ['officesByName', name, field], value: null };
                    });
                  }
                  else {
                    return _.map(fields, function (field) {
                      return { path: ['officesByName', name, field], value: office.doc[field] };
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
