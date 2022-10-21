const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const Serialize = require('php-serialize')
const crypto = require('crypto')
const app = express()
require('dotenv').config()
vendor = process.env.Vendor
authcode = process.env.Auth
pubKey = process.env.PubKey
//console.log(pubKey)

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/test", (req, res) => {
    if (validateWebhook(req.body)) {
        console.log('WEBHOOK_VERIFIED');
        res.send('this is where your code/license would be')
        res.status(200).end();
    } else {
        res.sendStatus(403);
        console.log('WEBHOOK_NOT_VERIFIED')
    }
})

function ksort(obj) {
    const keys = Object.keys(obj).sort();
    let sortedObj = {};
    for (let i in keys) {
        sortedObj[keys[i]] = obj[keys[i]];
    }
    return sortedObj;
}

function validateWebhook(jsonObj) {
    // Grab p_signature
    const mySig = Buffer.from(jsonObj.p_signature, 'base64');

    // Remove p_signature from object - not included in array of fields used in verification.
    delete jsonObj.p_signature;
    console.log(jsonObj)


    // Need to sort array by key in ascending order
    jsonObj = ksort(jsonObj);
    for (let property in jsonObj) {
        if (jsonObj.hasOwnProperty(property) && (typeof jsonObj[property]) !== "string") {
            if (Array.isArray(jsonObj[property])) { // is it an array
                jsonObj[property] = jsonObj[property].toString();
            } else { //if its not an array and not a string, then it is a JSON obj
                jsonObj[property] = JSON.stringify(jsonObj[property]);
            }
        }
    }
    // Serialise remaining fields of jsonObj
    const serialized = Serialize.serialize(jsonObj);
    // verify the serialized array against the signature using SHA1 with your public key.
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();

    const verification = verifier.verify(pubKey, mySig);
    // Used in response if statement
    return verification;
}

app.listen(8080)