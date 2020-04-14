`use strict`;
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
app.get('/', getBooks);

function getBooks(req, res) {
  let SQL = 'SELECT * FROM studnet;'
   client.query(SQL)
    .then(books => {
      // console.log(books.body.,"fffgg");
      res.render('pages/searches/index.ejs');
//       if(books.length == 0){
// console.log(books.body, "fffffffff");
//       }
//       else {
//         res.render('search/index.js',{book: books.rows});
//       }})
//       .catch (error=>{
//         console.log(error);
//       });

   
    
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`lisnting to port ${PORT}`);
    })
  }
  )





app.get('/search/error', (req, res) => {
  console.log("get reqest ", req.query);
  res.render('pages/search/error');
})
app.get('/search/new', (req, res) => {
  // console.log("get reqest ",req.body);
  // res.status(200).send('ok');
  res.render('pages/search/new');
  // res.redirect('/Search/new.ejs');
})
app.post('/search/show', (req, res) => {
  console.log("get reqest ", req.body);
  // res.status(200).send('ok');
  bookRout(req, res)
    .then(data => {
      // console.log(data,"ddd");
      res.render('pages/search/show', { book: data });

    })




  // res.redirect('/Search/new.ejs');
})


function BOOK(book) {
  this.title = book.volumeInfo.title;
  this.authors = book.volumeInfo.authors;
  this.description = book.volumeInfo.description;
  this.imageLinks = book.volumeInfo.imageLinks.thumbnail;
}

function bookRout(request, response) {
  let author = request.body.titleorauthor;
  console.log(author, "ffff")

  // getBook(author)

  let bookDataarr = [];
  console.log(request.body.title);
  let url = '';
  if (request.body.title == 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${author}&intitle:${author}`;
  }
  else {

    url = `https://www.googleapis.com/books/v1/volumes?q=${author}+inauthor:${author}`;
  }
  console.log(url, "vvvv");
  return superagent.get(url)
    .then(AuthorData => {
      try {
        AuthorData.body.items.map(val => {

          bookDataarr.push(new BOOK(val));


        });
        return bookDataarr;

      }
      catch (error) { response.redirect('./error') }
    })
}



// app.get('/error',(res,req)=>{
// res.render('error');
// })

app.get('/pages', (req, res) => {
  res.render('index');
})
app.get('*', (req, res) => {
  res.status(404).send('this route dosnt exixst');
})
app.listen(PORT, () => {
  console.log(`lisnting to PORT ${PORT}`);
})