const mysqlx = require('mysqlx');


const session = mysqlx.getSession({
    host: process.env.MYSQL_HOST, port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER, password: process.env.MYSQL_PASS
});


const db = session.getSchema('users');

const collection = db.getCollection('my_collection');

const doc = collection.find('')
