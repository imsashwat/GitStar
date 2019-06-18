const express = require('express')
const axios = require('axios'); //to perform http req on the url->id
const app = express();
var path = require('path');

app.set("view engine", "hbs") //handlebarsjs is used

app.use(express.json())  //basic encoding techniques
app.use(express.urlencoded({extended: true}))

//publi path accessible to views folder so that Css can be implemented
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/main'))  //middleware function

app.listen(8000)