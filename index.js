// importing the requirements for the project
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const LogEntry = require('./models/logentry');
const UserEntry  = require('./models/users')

// initializing expresss
const app = express();
// setting up port to be used by the server
const port = process.env.PORT || 5000;
// this is the url that is used to connect to the database
const url = process.env.DATABASE_URL || "mongodb://localhost:27017/mydb"
// connecting to the mongodb database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// settingup Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// settingup middleware to use static files
app.use(express.static(path.join(__dirname, '/public')));

// setting up view engine ejs to transfer data to the browser
app.set('views', './views');
app.set('view engine', 'ejs');
// 
app.get('/',(req,res)=>{
  res.render('index');
});

// getting signup page
app.get('/signup',(req,res)=>{
  res.render('signup')
});
// getting signin page
app.get('/signin',(req,res)=>{
  res.render('signin')
});

// Getting all events
app.get('/events', async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    if(entries.length === 0){
      res.redirect('/');
    };
    res.render('success',{
      entries:entries
    });
  }
   catch (error) {
    next(error);
  }
})

// saving user signup page data
app.post('/signup',async(req,res,next)=>{
  try {
    // initializing the schema and saving data gotten from the signup page
    const userEntry = new UserEntry(req.body);
    const createdEntry = await userEntry.save();
    res.redirect('/signin');
  } catch (error) {
    // handling error
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
})

// signin and vrifying whether user exist
app.post('/signin',(req,res)=>{
  let {email,password} = req.body;
   UserEntry.findOne({email:email,password:password},(err,user)=>{
    if(err){
      // handling error
      console.log(err)
      return res.status(500).send();
    }
    if(!user){
      // redirects to signup page if the user doesnot exist
      console.log('user not found')
      // status 404 is page not found
      return res.status(404).redirect('/signup')
    }
    // setting the user has signedin to true
    // status 2000 is ok
     return res.status(200).redirect('/')
  })
})

// saving and verifying data  to the database
app.post('/', async (req, res, next) => {
  try {
    // saving the data entered in index.html page if user is logged in
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.redirect('/events');
  }
  catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});


app.listen(port,()=>{
  console.log(`Server running on port ${port}`)
})