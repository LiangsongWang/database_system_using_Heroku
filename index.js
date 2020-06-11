const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  // connectionString: 'postgres://postgres:wlsdean@localhost/users'
  connectionString: process.env.DATABASE_URL
})

var app = express()

app.use(express.json());
app.use(express.urlencoded({extend:false}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));
app.get('/database',(req,res) => {
  var getUsersQuery = `SELECT * FROM usr`;
  pool.query(getUsersQuery,(error,result)=>{
    if (error){
      res.end(error);
    }
    var results = {'rows':result.rows}
    res.render('pages/db',results);
  })

});
app.post('/adduser',(req,res) => {
  console.log("psot request for /adduser");
  var uname = req.body.uname;
  var age = req.body.age;
  res.send(`username: ${ uname },age: ${ age }!!!`);
});
app.get('/users/:id',(req,res) =>{
  var uid = req.params.id;
  console.log(req.params.id);
  res.send("got it!");
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
