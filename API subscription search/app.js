const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
require('dotenv').config()
vendor = process.env.Vendor
authcode = process.env.Auth
pubKey = process.env.PubKey

//console.log(vendor, authcode)

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    if (req.query.subID != null) {
        let fetchSub = await axios.post('https://sandbox-vendors.paddle.com/api/2.0/subscription/payments', data = { vendor_id: vendor, vendor_auth_code: authcode, subscription_id: req.query.subID }, headers = { 'Content-Type': 'application/x-www-form-urlencoded' })
        console.log(fetchSub.data.response)


        res.render('home', { subs: fetchSub.data.response })
    }
    else { res.render('home.ejs') }
})


app.listen(8080)