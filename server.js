'use strict';
////////////////////
/// App setup  ////
//////////////////
require( 'dotenv' ).config();
const express = require( 'express' );
const pg = require ( 'pg' );
const superagent = require ( 'superagent' );
const methodOverride= require('method-override');
const PORT = process.env.PORT || 3000 ;
const app = express();
const client = new pg.Client (process.env.DATABASE_URL);
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.set('view engine' ,'ejs');
app.use(express.urlencoded({extended:false}));

/////////////////
///  Route   ////
////////////////

// app.get('/',homeHandler);
app.get('/' , homeHandler);
// app.get('/hello',helloHandler)
app.get('/about',aboutHandler)
app.get('/search', searchHandler)
app.post('/searches',showHandler)
app.get('*',errorsHandler);


///////////////////////
///Route Handler  ////
//////////////////////

function homeHandler(req,res){
// res.send('your server is work')
res.render('pages/index')
}

// function helloHandler(req,res){
//     res.render('pages/index'); 
// }
function searchHandler(req,res){
    res.render('pages/searches/new')
}
function aboutHandler(req,res){
    res.render('pages/about');
} 
function showHandler(req,res){
    let search = req.body.search;
    let name1 =req.body.titleOrAuthor;
    let url = `https://www.googleapis.com/books/v1/volumes?q=+in${search}:${name1}`;
    superagent.get(url)
    .then(result =>{
        let myData = result.body.items.map(element =>{
           return new Books(element)

        })
        let ahmad =result.body.totalItems;
      
      
        
        // res.render('pages/searches/show');
        // res.send(myData);
        res.render ('pages/searches/show' ,{booksData : myData, ahmad:ahmad});
       
        
    })
}
function errorsHandler(req,res){
res.send('we have error in path')
}

///////////////////
///constructor ////
//////////////////

function Books (element){
    this.id= element.id;
    this.title =(element.volumeInfo.title)?element.volumeInfo.title:'not available';
    this.description=(element.volumeInfo.description)? element.volumeInfo.description : 'not available';
    this.authors =(element.volumeInfo.authors)?element.volumeInfo.authors[0]:'not available' ;
    this.publishedDate =element.volumeInfo.publishedDate;
    this.imageLinks =(element.volumeInfo.imageLinks)? element.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    
}

/////////////////
///  listen  ////
////////////////

client.connect()
.then(()=>{
    app.listen(PORT , () =>
    console.log(`listening on ${PORT}`)
    );
})


