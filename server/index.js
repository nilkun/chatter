const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = "mongodb://localhost:27017/test-chat";
const PORT = 2001;

const errorColor = "\x1b[31m";
const okColor = "\x1b[32m";
const warningColor = "\x1b[33m";

console.log(warningColor, "Starting up server...");

const getTimeStamp = () => {
    const currentTime = new Date();
    const date = currentTime.getFullYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDate();
    let time = 
        (currentTime.getHours() + ":").padStart(3, "0")
        + (currentTime.getMinutes() + ":").padStart(3, "0")
        + (currentTime.getSeconds() + " ").padStart(3, "0");
        const timeStamp = '[ ' + date + ' ' + time + '] ';
    return timeStamp;
}

mongoose.connect(db, { useNewUrlParser: true }, err => {
    if(err) console.log(errorColor, getTimeStamp(), "Error connecting to database.");
    else console.log(okColor, getTimeStamp(), "connected to mongoDb.");
})

const Message = mongoose.model("message", { name : String, message : String })

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.json(messages)
    })
})

app.post('/messages', (req, res) => {
    console.log(okColor, getTimeStamp(), "Adding message to db");
    const message = new Message(req.body);
    message.save((err) => {
        if(err) {
            console.log(errorColor, getTimeStamp(), "Error: " + err);
            res.sendStatus(500);
        }
        else Message.find({}, (err, messages) => {
            res.json(messages)
        });
    })
})

app.delete('/messages', (req, res) => {
    console.log(warningColor, getTimeStamp(), "Received delete request")
    Message.deleteMany({}, (error => {
        if(error) {
            console.log(errorColor, getTimeStamp(), "Error removing entries");
            res.sendStatus(500);
        }
        else res.status(200).json("Deleted the whole lot");
    }));
})

const server = app.listen(PORT, () => {
    console.log(okColor, getTimeStamp(), "Server running on port", server.address().port);
});