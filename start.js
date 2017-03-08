var mongodb = require('mongodb'),
    mongoClient = mongodb.MongoClient,
    express = require('express'),
    app = express(),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    bodyParser = require('body-parser');
    
var conn_str = "mongodb://localhost:27017/test";
var store = new MongoDBStore({
    uri:"mongodb://localhost:27017/test",
    collection:'user_session'
});

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(
    session({
        secret:'test_sess_secret_key',
        resave:true,
        saveUninitialized:true,
        store:store
    })
);

store.on('error', function (req, res) {
    console.log("error");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.post('/login', function (req, res) {
    mongoClient.connect(conn_str, function(err, db){
        if(err){
            console.log(err);
        }else {
            db.collection("users").findOne({"username":req.body.username, "password": req.body.password}, function (err, result) {
                if(result){
                    req.session.loguser = result;
                    res.send("successful");
                }else {
                    res.send("fail");
                }
                db.close();
            })
        }
    })
});

app.get('/logout', function (req, res) {
    req.session.loguser = null;
    res.send("successful");
});

app.get('/isloggedin', function (req, res) {
    res.send(req.session.loguser?req.session.loguser:false);
});

app.post('/updatepassword', function (req, res) {
    mongoClient.connect(conn_str, function(err, db){
        if(err){
            console.log(err);
        }else {
            db.collection("users").update({"username":req.session.loguser.username, "password": req.session.loguser.password}, {$set: {"password": req.body.password}}, function (err, result) {
                res.send("successful");
                db.close();
            })
        }
    })
});

app.listen(8080, function () {
    console.log('Server running @ localhost:8080');
});