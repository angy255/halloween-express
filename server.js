const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection;

const url = "mongodb+srv://angymacodes_db_user:TioiyWRMwO2gwZM4@cluster0.5wlv0gm.mongodb.net/?appName=Cluster0";
const dbName = "halloweenie";

app.listen(3000, () => {
  console.log('Spooky season is here! Check port 3000');
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('ghost').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('ghost').insertOne({
    name: req.body.name, 
    msg: req.body.msg, 
    pic: req.body.pic, 
    genre: req.body.genre, 
    description: req.body.description,
    status: 'must-watch' // default status for new movies
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// New endpoint to update status
app.put('/messages/status', (req, res) => {
  db.collection('ghost')
  .findOneAndUpdate(
    {name: req.body.name, msg: req.body.msg}, 
    {
      $set: {
        status: req.body.status
      }
    }, 
    {
      sort: {_id: -1},
      upsert: false
    }, 
    (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    }
  )
})

app.delete('/messages', (req, res) => {
  db.collection('ghost').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})