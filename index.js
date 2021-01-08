'use strict'

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
let mongoClient;

const session = require('express-session');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended : false
}));

const urlDb = 'mongodb://localhost:27017';
const nameDb = 'exercice16';
const urlConnect = 8888;

let connect;

app.use('/src', express.static(__dirname + '/public/src'));
app.use('/img', express.static(__dirname + '/public/images'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

/*
app.post('/connect', (req, res) => {
  const user = req.body;
  console.log(req.body)
  if(user.email === db.user[0].email &&
    user.mdp === db.user[0].password){
      res.render('profile', {username : db.user[0].username});
    } else {
      res.render('index');
    }
});
*/
app.post('/connect', (req, res, next) => {
  const user = req.body;
  let find = false;
  let identity;
  const collection = mongoClient.collection('userbanks');
  const collectionArticle = mongoClient.collection('article');
  collection.find().toArray((err,data) => {
    data.forEach(object => {
      if(object.email === user.email && object.mdp === user.mdp){
        find = true;
        connect = true;
        identity = object;
      }
    });
    if(find){
      collectionArticle.find({username : identity.username}).sort({id : -1}).toArray((err,data) => {
        res.render('profile', {username : identity.username, article : data});
      });
    } else {
      res.render('index');
    }
  });
});

app.post('/create', (req, res, next) => {
  const user = req.body;
  let find = false;
  let identity;
  const collection = mongoClient.collection('userbanks');
  collection.find().toArray((err,data) => {
    data.forEach(object => {
      if(object.email === user.email || object.username === user.username){
        find = true;
      }
    });
    if(find){
      res.render('newaccount');
    } else {
      user.id = data.length + 1;
      collection.insertOne(user, (err, res) => {
        if(err) throw err;
        console.log('1 user inserted');
      })
      connect = true;
      res.render('profile', {username : user.username});
    }
  });
});

app.post('/createArt', (req, res, next) => {
  const user = req.body;
  let find = false;
  let identity;
  const collection = mongoClient.collection('userbanks');
  collection.find().toArray((err,data) => {
    data.forEach(object => {
      if(object.email === user.email || object.username === user.username){
        find = true;
      }
    });
    if(find){
      res.render('newaccount');
    } else {
      user.id = data.length + 1;
      collection.insertOne(user, (err, res) => {
        if(err) throw err;
        console.log('1 user inserted');
      })
      connect = true;
      res.render('profile', {username : user.username});
    }
  });
});

app.get('/newaccount', (req, res) => {
  res.render('newaccount');
});

app.get('/newpass', (req, res) => {
  res.render('newpass');
});

app.get('/newart', (req, res) => {
  res.render('newarticle');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.post('/messpass', (req, res) => {
  res.render('messpass');
});

app.post('/index', (req, res) => {
  res.render('index');
})

MongoClient.connect(urlDb, function(err, client){
  if(err){
      return
  }
  mongoClient = client.db(nameDb);
  app.listen(urlConnect, () => {
    console.log('Serveur lancé sur le port 8888');
  });
});