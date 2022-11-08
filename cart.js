const { async } = require('@firebase/util');
const { render } = require('ejs');
const { defaultMaxListeners } = require('events');
const express = require('express');
const app = express();
var router = express.Router();


app.use(express.static('PAA 6'));

app.set('view engine','ejs')
app.use(express.static(__dirname + '/views'));

const admin = require('firebase-admin');

//Setting the environment variable or port, or Port 3000
const port = process.env.PORT || 3000

let serviceAccount;
if (process.env.GOOGLE_CREDENTIALS != null) {
    serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
else {
    serviceAccount = require("./funko-pop-collectibles-firebase-adminsdk-5yj3y-1ce82ac086.json");
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//
const db = admin.firestore();
const cc = db.collection('items');
const use = db.collection('users');

(function($){ 
    $('.js-add-to-cart').each(function(){
        var nameProduct = $(this).parent().parent().parent().find('.js-name-detail').html();
        var productPrice = $(this).parent().parent().parent().find('.product-price').html();

        $(this).on('click', function(){
        console.log("Is it working?");
        }); 
    });



})(jQuery);