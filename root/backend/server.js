const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

// Used so we can store Environment Variables inside our .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors);
app.use(express.json());

MongoClient.connect('mongodb://localhost:27017/chatRoom', { useNewUrlParser: true },function (err, client) {
  if (err) throw err

  const db = client.db('chatRoom')

  db.collection('users').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

