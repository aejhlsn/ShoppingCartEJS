const { async } = require('@firebase/util');
const { render } = require('ejs');
const { defaultMaxListeners } = require('events');
const express = require('express');
const app = express();
var router = express.Router();
let bodyParser = require('body-parser')

app.use(express.static('PAA 6'));

app.set('view engine','ejs')
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({extended : true}));

const admin = require('firebase-admin');
const { get } = require('http');

//Setting the environment variable or port, or Port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT,);

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


app.get('/', async (req, res) => {
    const items = await cc.get();
    console.log(items.docs.length);

    //FOR SHOPPING CART
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();
    
    let data = {
        url: req.url,
        itemData: items.docs,
        shopData: doc_child.docs,
    }
    res.render('index', data);
    console.log(JSON.stringify(data))
});

app.get('/index', async (req, res) => {
    const items = await cc.get();
    console.log(items.docs.length);

    
    //FOR SHOPPING CART
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();
    
    let data = {
        url: req.url,
        itemData: items.docs,
        shopData: doc_child.docs,
    }
    res.render('index', data);
    console.log(JSON.stringify(data))
    console.log(data['shopData'].length)
});


app.get('/product', async (req, res) => {
    const items = await cc.get();
    console.log(items.docs.length);
    
    let data = {
        url: req.url,
        itemData: items.docs
    }
    res.render('product', data);
    console.log(JSON.stringify(data))
});

app.get('/product-detail', async (req, res) => {
    const items = await cc.get();
    console.log(items.docs.length);

    //FOR SHOPPING CART
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();
    
    let data = {
        url: req.url,
        itemData: items.docs,
        shopData: doc_child.docs,
    }
    
    res.render('product-detail', data);
    console.log(JSON.stringify(data))
});


app.get('/', async function (req, res) {
    const items = await cc.get();
    
    let stuff = []
    items.forEach(docs => {
        let id = docs.id
        let data = docs.data

        stuff.push({id, ...data});
    });

    console.log(stuff)

    res.status(200).send(JSON.stringify(stuff))


});


app.get('/product-detail/:itemid', async (req, res) => {
    try {
        console.log(req.params.itemid);
    } catch (e) {
    }
    const item_id = req.params.itemid;
    const item_ref = cc.doc(item_id);
    const doc = await item_ref.get();

    //FOR SHOPPING CART
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();
    
    
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
    }
    
    let data = {
        url: req.url,
        id: item_id,
        itemData: doc.data(),
        shopData: doc_child.docs,
    }
    res.render('product-detail', data);


});


app.get('/production', async (req, res) => {
    try {
        console.log(req.params.itemid);
    } catch (e) {
        console.log('nothing');
    }
    const item_id = req.params.itemid;
    const item_ref = cc.doc(item_id);
    const doc = await item_ref.get();

    const sfRef = cc.doc(item_id);
    const collections = await sfRef.listCollections();
    const docu = collections.forEach(collection => {
        console.log('Found subcollection with id:', collection.id);});

});


app.post('/product-detail/productions/:itemid/:numprod', async (req, res) => { 
    
    //ITEM DATABASE ACCESS
    const item_id = req.params.itemid;
    const item_ref = cc.doc(item_id);
    const docus = await item_ref.get()

    //FOR USER ACCESS
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();

    //USER SUBCOLLECTION ACCESS
    const shopcart = user_ref.collection('cart');
    const add_shop = shopcart.doc(item_id);
    const doc_child = await shopcart.get();

    //--------------------------------------------------------
    const sfRef = use.doc(userID);
    const collections = await sfRef.listCollections();
    const docu = collections.forEach(collection => {
        console.log('Found subcollection with id:', collection.id);
    });
    //--------------------------------------------------------

    console.log(doc_child.docs.length);

    console.log(shopcart.doc.length);
    console.log(req.params.numprod);


    let user_cart = {
        url: req.url,
        itemData: doc_child.docs,
    }

    let productInform = information_array(docus.data());
    var formInfo = req.body

    const respond = await add_shop.set({
        name: productInform[0]['name'],
        photoURL: productInform[0]['photoURL'][1],
        price: productInform[0]['price'],
        qty: parseInt(formInfo['num-product']),
    });

    console.log(respond)
});

function information_array(document){
    let productInfo = [];
    productInfo.push(document);
    console.log(productInfo);
    return productInfo;
}




// SHOPPING CART ROUTE 

app.post('/product-detail/shopping-cart', async (req, res) => {
   res.redirect('/')
});

app.get('/shopping-cart', async (req, res) => {
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();

    const items = shopcart.doc();
    const itemDocs = await items.get();

    let data = {
        url: req.url,
        itemData: doc_child.docs,
    }

    let cartData = []
    for (var index = 0; index < data['itemData'].length; index++){
        itemID = data['itemData'][index].id;
        itemDoc = cleanFile(data['itemData'][index]['_fieldsProto']);
        totalPerItem = itemDoc[0]['price']['integerValue'] * itemDoc[0]['qty']['integerValue'];
        cartData.push(
            {
                ID: itemID,
                name: itemDoc[0]['name']['stringValue'],
                price: itemDoc[0]['price']['integerValue'],
                qty: itemDoc[0]['qty']['integerValue'],
                totalItem: totalPerItem, 
            }
        )
    }

    console.log("Calculated Return: ", cartData)
    console.log(cartData.length);
    itemTotalAmount = totalAmount(cartData);

    let cartReport = {
        url: req.url,
        itemData: doc_child.docs,
        itemsInCart: cartData,
        total: itemTotalAmount,
    }
    res.render('shopping-cart', cartReport)
    res.render('index', cartReport)

});


function cleanFile(documents){
    items = []
    items.push(documents);
    console.log("FILES : ", documents);
    return items;
}

function totalAmount(documents){

    var totalAmount = 0;
    for(var index = 0; index < documents.length; index++){
        totalAmount += documents[index]['totalItem']
    }
    console.log("Total: ", totalAmount)
    return totalAmount;
}

app.get('/remove/:itemid', async(req, res, next) => {
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();

    item_id = req.params.itemid;
    const items = shopcart.doc(item_id);
    const itemDocs = await items.get();

    const respond = await items.delete();
    
    res.redirect('/shopping-cart');
    next();
});

app.get('/shopping-cart', async (req, res, next) => {
    const userID = '939ZEcMO7hFy9ULNvfex'
    const user_ref = use.doc(userID);
    const doc = await user_ref.get();
    const shopcart = user_ref.collection('cart');
    const doc_child = await shopcart.get();

    item_id = req.params.itemid;
    const items = shopcart.doc();
    const itemDocs = await items.get();

   var dd = req.query
   console.log(req.url)

});




//console.log(JSON.stringify(cc))

//res.status(200).send(JSON.stringify(items))

