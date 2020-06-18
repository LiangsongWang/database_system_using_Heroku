const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const {
  Pool
} = require('pg');
var pool;
pool = new Pool({
  // connectionString: 'postgres://postgres:wlsdean@localhost/users'
  connectionString: process.env.DATABASE_URL
})

var app = express()

app.use(express.json());
app.use(express.urlencoded({
  extend: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));
app.get('/home', (req, res) => res.render('pages/home'));
app.get('/add', (req, res) => res.render('pages/add'));
app.get('/del', (req, res) => res.render('pages/del'));
app.get('/upd', (req, res) => res.render('pages/upd'));
app.get('/database', (req, res) => {
  var getUsersQuery = `SELECT * FROM Person`;
  pool.query(getUsersQuery, (error, result) => {
    if (error) {
      res.end(error);
    }
    var results = {
      'rows': result.rows
    }
    res.render('pages/db', results);
  })

});

app.get('/mainpage', (req, res) => {
  var getUsersQuery = `SELECT * FROM Person`;
  pool.query(getUsersQuery, (error, result) => {
    if (error) {
      res.end(error);
    }
    var results = {
      'rows': result.rows
    }
    res.render('pages/mp', results);
  })

});


app.post('/add_person', (req, res) => {
  console.log("post request for /add_person");
  var name = req.body.name;
  var size = req.body.size;
  var height = req.body.height;
  var type = req.body.cType;
  res.send(`insert a person name: ${ name },size: ${ size },height: ${height},type: ${type}`);
  pool.query(
    `INSERT INTO Person VALUES('${ name }', ${ size }, ${ height }, '${ type }')`,
    (err, res) => {
      console.log(err, res);
    }
  );

});



app.post('/del_person', (req, res) => {
  console.log("post request for /add_person");
  var name = req.body.name;
  res.send(`delete a person  name: ${ name }`);
  pool.query(
    `DELETE FROM Person WHERE name='${ name }'`,
    (err, res) => {
      console.log(err, res);
    }

  );

});


app.post('/upd_person', (req, res) => {
  console.log("post request for /add_person");
  var name = req.body.name;
  var size = req.body.size;
  var height = req.body.height;
  var type = req.body.cType;
  res.send(`update ${ name } \nsize: ${ size },height: ${height},type: ${type}`);
  pool.query(
    `UPDATE Person  SET size =${ size }, height = ${ height },type = '${ type }' WHERE name ='${ name }'`,
    (err, res) => {
      console.log(err, res);
    }
  );

});



app.get('/person/:name', (req, res) => {
  var name = req.params.name;
  console.log(req.params.name);
  var getUsersQuery = `SELECT * FROM Person WHERE name = '${name}'`;
  pool.query(getUsersQuery, (error, result) => {
    if (error) {
      res.end(error);
    }
    var results = {
      'rows': result.rows
    }
    res.render('pages/db', results);
  })
});




app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
