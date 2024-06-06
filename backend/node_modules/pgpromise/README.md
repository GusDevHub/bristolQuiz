# pgPromise [![Build Status](https://secure.travis-ci.org/vjames19/pgpromise.png?branch=master)](http://travis-ci.org/vjames19/pgpromise)

Returns promises instead of using callbacks.

## Getting Started
Install the module with: `npm install pgpromise`

```javascript
var pg = require('pg');
var PgPromise = require('pgpromise');

// use connection string or connection config object
var conString = "postgres://postgres:1234@localhost/postgres";
var db = new PgPromise(pg, conString);

// make promised queries.
db.connect().then(function(conn) {
  conn.client.queryP('SELECT * from table').then(function(result) {
    console.log(result.rows);
  });
});

```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Victor J. Reventos. Licensed under the MIT license.
