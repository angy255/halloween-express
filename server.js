const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db, collection;

const url = "mongodb+srv://angymacodes_db_user:ONccOtJBvl6GbKFP@cluster0.5wlv0gm.mongodb.net/?appName=Cluster0";
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
app.use(express.static('public')) //this is how we connect the public folder to index.ejs so no need to be redundant in addressing public folder in ejs


app.get('/', (req, res) => {
  db.collection('ghost').find().toArray((err, result) => {    //here you could add .sort({thumbUp: -1}) after .find() to sort
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('ghost').insertOne({name: req.body.name, msg: req.body.msg, pic: req.body.pic, genre: req.body.genre, description: req.body.description, thumbUp: 0, thumbDown:0,}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
// add a variable for the thumbDown
  let thumbDownLogic
//create conditional to toggle between put for thumbUp and thumbDown
// if this is truthy, 
  if (Object.keys(req.body)[2] == 'thumbUp') {
// then set it to this
    thumbDownLogic = req.body.thumbUp + 1 
  }else if (Object.keys(req.body)[2] == 'thumbDown'){
    thumbDownLogic = req.body.thumbDown - 1
  }

  db.collection('ghost')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp: thumbDownLogic
    }
  }, {
    sort: {_id: -1}, //this is serving no purpose here
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('ghost').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
