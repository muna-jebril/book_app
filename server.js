`use strict`;
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
  
app.use(express.static('./public'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);


app.get('/', getBooks);

app.get('/bookResult/:value_id',bookdetails);
app.put('/add/:value_id', updateBOOKS);
function updateBOOKS(req, res){
   let {authors,title,isbn,imageLinks,description,bookshlef} = req.body;
  let SQL = 'UPDATE studnet SET author=$1,title=$2,isbn=$3,img_url=$4, description=$5,bookshelf=$6 WHERE id=$7;'
let values= [authors,title,isbn,imageLinks,description,bookshlef,req.params.value_id];
console.log(req.params,"zzzzzzz");

client.query(SQL,values)
.then(()=>{
  console.log(req.body,"fffassdf");
  res.redirect(`/bookResult/${req.params.value_id}`)
})

}
app.delete('/delete/:value_id',(req,res)=>{
 let safeValues= [req.params.value_id];
  let SQL = 'DELETE FROM studnet WHERE id=$1;'
client.query(SQL,safeValues)
.then(()=>{
  res.redirect(`/`);
})


});

function bookdetails(req,res){
  let SQL = `SELECT * FROM studnet WHERE id=$1;`
  console.log(req.params, "fff");
    let values= [req.params.value_id];
    // console.log(req.params,"xxxxx");
    return client.query(SQL,values)
    .then(details=>{
      console.log(details.rows,"sssss");
      res.render('pages/books/show',{result:details.rows});
    })
}

// app.get('/books/:Id', Details);

app.post('/books',  addBook );



function addBook (req,res){
  

  let {authors,title,isbn,imageLinks,description,bookshlef}=req.body;
  console.log(req.body,"dddd");
  let safeValues= [authors,title,isbn,imageLinks,description,bookshlef];
  let SQL = `INSERT INTO studnet (author,title,isbn,img_url,description,bookshelf) VALUES($1,$2,$3,$4,$5,$6);`;
   return client.query(SQL,safeValues)
  .then(()=>{res.redirect('/')})
  
}

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





let count = 0 ;
function getBooks(req, res) {
  
  let SQL = 'SELECT * FROM studnet;'
  return  client.query(SQL)
  .then(results => {
    count = results.rows.length;
    console.log(count,'count');
    console.log(results.rows,"gggg");
    res.render('pages/search/index', { books:results.rows });
    });
  }
  
   
  // the constractor 
  function BOOK(book) {
    this.title = book.volumeInfo.title 
    this.authors = book.volumeInfo.authors;
  this.description = book.volumeInfo.description;
  this.imageLinks = book.volumeInfo.imageLinks.thumbnail;
  this.isbn = book.volumeInfo.industryIdentifiers[0].type;
  
  
}

function bookRout(request, response) {
  let author = request.body.titleorauthor;
  console.log(author, "ffff")
  
  
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





app.get('*', (req, res) => {
  res.status(404).send('this route dosnt exixst');
})


client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`lisnting to port ${PORT}`);
    })
  }
  )