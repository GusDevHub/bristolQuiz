/*
 * pgPromise
 * https://github.com/vjames19/pgPromise
 *
 * Copyright (c) 2014 Victor J. Reventos
 * Licensed under the MIT license.
 */

'use strict';

var q = require('q');

var PgPromise = function(pg, pgConfig) {
  this.pg = pg;
  this.pgConfig = pgConfig;
};

PgPromise.prototype.connect = function() {
  var deferred = q.defer();
  this.pg.connect(this.pgConfig, function(err, client, done) {
    if(err) {
      deferred.reject(err);
    } else {
      client.queryP = q.nbind(client.query, client);
      deferred.resolve({client: client, done: done});
    }
  });

  return deferred.promise;
};

module.exports = PgPromise;
