const express = require('express')
const axios = require('axios');
const app = express();
var path = require('path');

app.set("view engine", "hbs")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/main'))

app.listen(8000)