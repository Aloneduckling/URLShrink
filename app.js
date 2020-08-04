const express = require("express"),
    bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();


mongoose.connect("mongodb://localhost/red", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//database config

const redirectSchema = new mongoose.Schema({
    slug: String,
    destination: String
});
const Redirect = new mongoose.model("Link", redirectSchema);

//creating the routes

//root
app.get("/", (req, res) => {
    res.render("index");
});

//show all the routes
app.get("/urls/show", (req,res) => {
    Redirect.find({}, function(err, allData){
        if(err){
            console.error();(err);
            // res.render("err", {err: err});
            res.redirect("/");
        }else {
            res.render("show",{data: allData});
        }
    });
});

app.post("/generate", (req, res) => {
    //check duplicate
    Redirect.findOne({
        slug: req.body.redirect.slug
    }, function (err, data) {
        //if database error
        if (err) {
            console.error("ERROR: " + err);
        }
        //if no data found then process ok 
        else if (!data) {
            Redirect.create(req.body.redirect, function (err, data) {
                if (err) {
                    console.error(err);
                }
            });
            res.redirect("/");
        } else {

            res.send("Slug already in use, please choose a different one");
        }
    });
});

app.get("/:slug", redirectTo);
//------------------------
//API for front end

//check duplicate AJAX api
app.get("/api/check/:slug", (req, res) => {
    checkDuplicate(req, res);
});

app.listen(process.env.PORT, process.env.IP);

function redirectTo(req, res) {
    const slug_url = req.params.slug;
    Redirect.findOne({
        slug: slug_url
    }, function (err, data) {
        if (err || !data) {
            console.error("ERROR(non API): " + err);
            res.redirect("/");
        } else {
            const i = data.destination.search("://");
            if (i === -1) {
                return res.redirect(301, `http://${data.destination}`);
            } else {

                return res.redirect(301, `http://${data.destination.slice((i+3), data.destination.length)}`);
            }
        }
    });
}

function checkDuplicate(req, res) {
    let result;
    Redirect.findOne({
        slug: req.params.slug
    }, function (err, data) {
        if (!data) {
            result = {
                "err": "none"
            };

            res.send(result)
        } else if (err) {
            result = {
                "err": "Some Error Occoured"
            };

            res.send(result);
        } else {
            result = {
                "err": "Slug already taken"
            };

            res.send(result);
        }
    });

}