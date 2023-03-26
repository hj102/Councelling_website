const express = require('express');
const ejs = require('ejs')
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');
const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'hj11018210045',
    password: 'Babo$@123',
    database: 'mytable'
  });
try {
    connection.connect();
    console.log('Database connected');
} 
  catch (error) {
    console.log('Error connecting to database', error);
}
app.use(session({
    secret: 'hj123456778',
    resave: false,
    saveUninitialized: true
  }));
  
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
});
app.get('/sign-in',function(req,res){
    res.sendFile(__dirname + '/signin.html')
})
app.get('/opensignup',function(req,res){
    res.sendFile(__dirname + '/signup.html')
})
app.get('/mybookings',function(req,res){
  if(req.session.name){
    connection.query('SELECT * FROM booking where user_info=? ',[req.session.name],(error,result)=>{
    if (error) throw error
    newres = JSON.parse(JSON.stringify(result))
    res.render('mybookings',{newres:newres});
  });
  }
  else{
    res.redirect('/')
  }
})
app.post('/bookingInfo',function(req,res){
  const tid = req.query.data
  const apdtime = req.body.appdate
  console.log(req.session.name)
  connection.query('INSERT INTO booking (user_info,t_id,appointment) VALUES (?,?,?)',[req.session.name,tid,apdtime],(error,therapistres)=>{
    if (error) throw error

    res.send('data saved');
  });
  
})
app.post('/booktherapist',function(req,res){
  if(!req.session.name){
    res.redirect('/sign-in')
  }
  else{
    connection.query('SELECT * FROM therapist',(error,therapistres)=>{
      if (error) throw error
      var fruits = JSON.parse(JSON.stringify(therapistres))
      res.render('Therapist', { fruits:fruits });
    });
  }
})

app.post('/checksignin', (req, res) => {
  const name= req.body.username;
  const password= req.body.password;
  connection.query('SELECT username,password FROM user_info WHERE username=? and password=?', [name,password],(error,results)=>{
    if(error) throw error
    if(results.length>0)
     var mod_res = JSON.parse(JSON.stringify(results))
     req.session.name = mod_res[0].username
     res.redirect('/')
     
  })

});
app.get('/therapistregister',function(req,res){
  res.sendFile(__dirname + '/Therapistsignup.html');
})
app.post('/therapist-register', (req, res) =>{
  const name = req.body.Name;
  const gender = req.body.gender;
  const language = req.body.Language;
  const state = req.body.State;
  const experience = req.body.Experience;
  const charges = req.body.Charges;
  const qualifications = req.body.Qualification;
  const email = req.body.Email;
  const password = req.body.Password;
  connection.query("INSERT INTO therapist (Name, Gender, Language, State, Experience, Charges, Qualification, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, gender, language, state, experience, charges, qualifications, email, password], (error, result) => {
      if (error) throw error;
      res.redirect('/');
  });
});
app.post('/usersignup',(req,res)=>{
    const name= req.body.username;
    const password= req.body.password;
    const gender=req.body.gender;
    console.log(req.body.username)
    connection.query('INSERT INTO user_info (username,password,gender) VALUES (?, ?, ?)', [name,password,gender],(error,results)=>{
      if(error) throw error
      res.redirect('/')
    })
  })
  
 
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
