const express = require('express')
const axios = require('axios');
const app = express();

app.set("view engine", "hbs")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', require('./routes/main'))

app.listen(8000)