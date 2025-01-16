## Create the `database` folder and `db-connector.js`

From the root of our project, create a folder called `database`. (Done) We want to stay organized, this is a step in that direction. Next, create a file in that folder called `db-connector.js`, and paste the following into it, replacing the values in brackets. (you will need to do this part yourself)

```javascript
// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'host_address',
    user            : 'user',
    password        : 'db_password',
    database        : 'db_name'
})

// Export it for use in our applicaiton
module.exports.pool = pool;
```
