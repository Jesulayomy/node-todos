const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require("dotenv").config();

const url = process.env.DB_URL;
const dbName = "todos";

MongoClient.connect(url).then((client) => {
  console.log("Connected to `" + dbName + "`!");
  const db = client.db(dbName);

  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(express.static('public'))

  app.get('/', (req, res) => {
    db.collection('todos').find().toArray().then(result => {
      res.render('index.ejs', {todos: result})
    });
  });

  app.post('/todos', (req, res) => {
    db.collection('todos').insertOne({todo: req.body.todo, done: false}).then(result => {
      console.log('Task saved to database')
      res.redirect('/')
    });
  });

  app.put('/todos', (req, res) => {
    db.collection('todos')
    .findOneAndUpdate({todo: req.body.todo}, {
      $set: {
        done: !req.body.done
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }).then(result => {
      res.send(result)
    });
  });

  app.delete('/todos', (req, res) => {
    // , msg: req.body.msg
    db.collection('todos').findOneAndDelete({todo: req.body.todo}).then(result => {
      res.send('Task deleted!');
    });
  });

  app.listen(3000, () => console.log("Listening at port 3000"));
});
