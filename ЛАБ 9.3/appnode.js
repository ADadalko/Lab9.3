
const express = require("express");
const app = express();



const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;



const jsonParser = express.json();


const mongoClient = new MongoClient("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



app.set("view engine", "pug");

let dbClient;

app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/resource"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/html"));
app.use(express.static(__dirname + "/js"));

let a = "";
let aud = "";
mongoClient.connect(function (err, client) {
  if (err) return console.log(err);
  dbClient = client;
  app.locals.collection = client.db("ordersdb").collection("order");
  const db = client.db("ordersdb");
  db.collection("order")
    .find({ time: {$gt : 102} })
    .toArray(function (err, doc) {
      console.log("Товары, заказы по которым превышают 100");
      for(let i = 0; i < doc.length; i++){
      console.log(doc[i].name);
      a = {
        result: doc,
      };
      }
    });
  app.listen(3000, function () {
    console.log("Сервер работает");
  });
});

app.use("/orders", function (req, res) {
  res.render("orders", a);
});

app.get("/api/users", function (req, res) {
  const collection = req.app.locals.collection;
  collection.find({}).toArray(function (err, users) {
    if (err) return console.log(err);
    res.send(users);
  });
});
app.get("/api/users/:id", function (req, res) {
  const id = new objectId(req.params.id);
  const collection = req.app.locals.collection;
  collection.findOne({ _id: id }, function (err, user) {
    if (err) return console.log(err);
    res.send(user);
  });
});

app.post("/api/users", jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const userName = req.body.name;
  const sheduleLesson = req.body.lesson;
  const sheduleTime = req.body.time;
  const user = {
    name: userName,
    lesson: sheduleLesson,
    time: JSON.parse(sheduleTime)
  };
  const collection = req.app.locals.collection;
  collection.insertOne(user, function (err, result) {
    if (err) return console.log(err);
    res.send(user);
  });
});

app.delete("/api/users/:id", function (req, res) {
  const id = new objectId(req.params.id);
  const collection = req.app.locals.collection;
  collection.findOneAndDelete({ _id: id }, function (err, result) {
    if (err) return console.log(err);
    let user = result.value;
    res.send(user);
  });
});

app.put("/api/users", jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const id = new objectId(req.body.id);
  const userName = req.body.name;
  const sheduleLesson = req.body.lesson;
  const sheduleTime = req.body.time;

  const collection = req.app.locals.collection;
  collection.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        lesson: sheduleLesson,
        name: userName,
        time: JSON.parse(sheduleTime)
      },
    },
    { returnOriginal: false },
    function (err, result) {
      if (err) return console.log(err);
      const user = result.value;
      edit = result.value;
      res.send(user);
    }
  );
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
