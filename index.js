const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/list.js');
const router = express.Router();
const List = require('./models/list.js');
const crawler = require('./utils/crawler').crawler
// import {crawler} from './utils/crawler'
/* Databas connection */
const mongoose = require('mongoose');
//const uri =  ('mongodb://localhost:27017/clothes');
const db = mongoose.connection;
db.once('open', () => {
    console.log("Connected to MongoDB server");
});
mongoose.set('useNewUrlParser', true);

mongoose.connect('mongodb://localhost/clothes').then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
});



/*db.on('error', console.error);
db.once('open', () => {
    console.log("Connected to MongoDB server");
});
mongoose.connect('mongodb://localhost/clothes')*/

// MiddleWare setting
app.use(express.static('public/views'));
app.use(express.static('public/scripts'));
app.set('views', __dirname+'/public/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// Routing
app.get('/', (req, res) => {
    res.render('login.html');
})


// Crawler
app.get('/crawler', async (req, res) => {
    const result = await crawler();
    //console.log(result)
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="./main.css">
        <title>옷 어디서 사지</title>
        
    </head>
    <body>
        <div class = "content wrapper">
            <div class="navbar">
                <strong>옷 어디서 사지</strong>
            </div>
            <div class = "gotobasket"> 
                <Strong><a href = "/basket">장바구니</a></strong>
            </div>
            <div class = "shopping">
                <div class = "degree">
                    <p id = "ninety"><strong>98도씨</strong></p>
                    <div class="total-item-wrapper">
                        ${result[0].map(item => `
                        <form method="POST" class="first item-wrapper" action="/basket">
                            <a href = "${item.linkpage}"><img class="item-image" src="${item.src}" /></a>
                            <div class="item-title">${item.title}</div>
                            <div class = "item-price">${item.price}</div>
                            <input type="text" name="src" value="${item.src}" style="display: none" />
                            <input type="text" name="title" value="${item.title}" style="display: none" />
                            <input type="text" name="price" value="${item.price}" style="display: none" />
                            <button id="btn_load" type="submit">장바구니</button>
                        </form>
                        `).reduce((a, b) => a + b, "")}
                    </div>
                </div>
                <div class = "lala">
                    <p id ="ninety"><strong>라라봉</strong></p>
                    <div class="total-item-wrapper">
                        ${result[1].map(item => `
                        <form method = "POST" action="/basket" class="second item-wrapper">
                            <a href = "${item.linkpage2}"><img class="item-image" src="${item.src2}"/></a>
                            <div class="item-title">${item.title2}</div>
                            <div class = "item-price">${item.price2}</div>
                            <input type="text" name="src" value="${item.src2}" style="display: none" />
                            <input type="text" name="title" value="${item.title2}" style="display: none" />
                            <input type="text" name="price" value="${item.price2}" style="display: none" />
                            <button id ="btn_load" type="submit">장바구니</button>
                        </form>
                        `).reduce((a, b) => a + b, "")}
                        
                    </div>
                    
                <div>
        </div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
        <script type="text/javascript" src="./control.js"></script>
    </body>
    </html>
    `)
})



router.get('/', function(req, res, next){
    res.render('index', {title : 'Express'});
});

app.post('/api/v1/add', function(req, res){
    console.log("POST /api/v1/add")
    const name = req.body.username;
    
    User.findOne({name: name}, function(err,user){
        if(err){
                console.log(err);
                //return res.status(500).end("Error : cannot update");
                return res.redirect('/');
        }
        console.log(user)

        if(user.password !== req.body.password){
                console.log('login fail');
                return res.redirect('/');
        }
        else{
            console.log("success");
            res.redirect("/crawler");
        }
        

        /*if(!user){
            if(req.body.password===0)
                return res.status(404).json({error : 'user not found'})
        }

        return res.status(200).send();*/

    })

});

app.post("/register", (req, res) => {
    const name = req.body.username
    console.log(name)
    const password = req.body.password
    console.log(password)

    const newUser = new User()
    newUser.name = name
    newUser.password = password

    newUser.save((err) => {
        if (err) {
            console.log(err)
        }
        return res.redirect("/")
    })    
})

app.post("/basket", (req, res)=>{
    const list =  new List();//new List();
    //list.name =null;
    //list.password=null;
    console.log(req.body.title);
    console.log(req.body.price);
    console.log(req.body.src);
    list.title = req.body.title;
    list.price = req.body.price;
    list.src = req.body.src;
    list.linkpage=req.body.linkpage;
    //console.log('***')
    console.log(list)
    //console.log('***')

    list.save(err=>{
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            //res.send("okay")
            // alert('Successfully saved!')
            // return res.redirect('/crawler');
    });
    // console.log(req.body)
})

app.get('/basket', async(req, res) => {
    //console.log(user)
    /*const title = req.body.title;
    User.find({title : title},  function(err, user){
        if(user.password==null && user.name==null){
            res.json(user)
        }
    })*/
    /*List.find({}, (err, lists) => {
        console.log(lists)
        return res.json(lists)
    })*/
    const list = await List.find()

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="./basket.css">
        <title>옷 어디서 사지</title>
        
    </head>
    <body>
        <div class = "content wrapper">
            <div class="navbar">
                <strong style = "color : red" "background-color : black">장바구니</strong>
            </div>
            <div class="total-item-wrapper">
                ${list.map(item => `
                <div class="first basket-item-wrapper">
                    <a href = "https://98doci.com${item.linkpage}"><img class="item-image" src="${item.title}"/></a>
                    <div class="item-title">${item.src}</div>
                    <div class = "item-price">${item.price}</div>
                    
                </div>
                `).reduce((a, b) => a + b, "")}
            </div>
                        
        </div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
        <script type="text/javascript" src="./control.js"></script>
    </body>
    </html>
    `)
})

const server = app.listen(8000, () => {
    console.log('server is running at 8000');
});