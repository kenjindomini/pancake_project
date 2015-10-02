var $ref = require('falcor').Model.ref;
var Router = require('falcor-router');
var _ = require('lodash');
var PouchDB = require('pouchdb');
var db = new PouchDB('data/user');
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
    route: 'usersAscendingSort[{ranges:indexRanges}]',
    get: function (pathSet) {
      var rangeChecker = function (user, i) {
        return inRange(pathSet.indexRanges)(i);
      };
      console.log("Ascending sort.");
      var rangeLimit;
      _.some(pathSet.indexRanges, function (range) {rangeLimit = (range.to - range.from) + 1;});
      console.log(pathSet.indexRanges);
      console.log(rangeLimit);
      /*return db.allDocs({ include_docs: true })
       .then(function (res) {
            console.log(res.rows);
            var jsonGraph = _(res.rows)});
       /*.map(function (user, i) {
       //console.log(user, i);

       return {
       path: ['usersAscendingSort', i],
       value: $ref(['usersById', user.doc.uid])
       };
       })
       .filter(rangeChecker)
       .value();*/
      //TODO: sort pouchDB result
      //TODO: Test pouchdb quick search.
      return db.allDocs({ include_docs: true })
            .then(function (res) {
              console.log(res);
              var jsonGraph = _(res.rows)
                  .map(function (user, i) {

                    return {
                      path: ['usersAscendingSort', i],
                      value: $ref(['usersById', user.doc.uid])
                    };
                  })
                //.filter(rangeChecker)
                  .value();
              //var sortedJsonGraph = _.sortBy(jsonGraph, "name");
              //console.log(JSON.stringify(sortedJsonGraph, null, 2));
              console.log(JSON.stringify(jsonGraph, null, 2));
              console.log("Returning from usersAscendingSort.");
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
      var rangeChecker = function (user, i) {
        return inRange(pathSet.indexRanges)(i);
      };
      return db.allDocs({include_docs: true})
          .then(function (res) {
            var jsonGraph = _(res.rows)
                .map(function (user, i) {
                  //console.log(user, i);
                  return {
                    path: ['usersDescendingSort', i],
                    value: $ref(['usersById', user.doc.uid])
                  };
                })
                .filter(rangeChecker)
                .value();
            //console.log(JSON.stringify(jsonGraph, null, 4));
            var sortedJsonGraph = _.sortBy(jsonGraph, "name")
                .reverse()
                .value();
            console.log(JSON.stringify(sortedJsonGraph, null, 2));
            console.log("returning from descending sort.");
            return sortedJsonGraph;
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
      return db.allDocs({include_docs: true})
          .then(function (res) {
            return _(pathSet.ids)
                .map(function (id) {
                  var user = _.find(res.rows, {doc: {uid: id}});
                  // TODO null the record if the id can't be found
                  return _.map(fields, function (field) {
                    // TODO consider missing field support more closely
                    return {path: ['usersById', id, field], value: user.doc[field]};
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
    route: 'offices[{keys:names}]["office","address"]',
    get: function (pathSet) {
      var fields = pathSet[2];
      return db.allDocs({include_docs: true})
          .then(function (response) {
            return (pathSet.names)
                .map(function (name) {
                  var office = _.find(response.rows, {doc: {office: name}});
                  if (user == undefined) {
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
