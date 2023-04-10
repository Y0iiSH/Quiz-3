const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000

app.get('/hello', verifyToken , (req, res) => {
  console.log(req.user)

  res.send('Hello World!')
})

app.get('/bye', (req, res) => {
    res.send('Bye Bye World!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let dbUsers = [
  {
      username: "amrl",
      password: "sayahebat",
      name: "Amirul",
      email: "mirull01@gmail.com"
  },
  {
      username: "shfq",
      password: "sayatakhebat",
      name: "Shafiq",
      email: "shaffiq01@gmail.com"
  },
  {
      username: "wkwkwk",
      password: "hshshs",
      name: "hahaha",
      email: "hehehe@gmail.com"

  }
]

//enable json body parsing
app.use(express.json());

app.post('/', (req, res) => {
    let data = req.body
    res.send(
      login(
        data.username,
        data.password
      )
    );
});

app.use(express.json());

app.post('/register', (req, res) => {   
  let data = req.body
  res.send(
    register(
    data.username,
    data.password,
    data.name,
    data.email
    )
      
    );
    });


    

// create a POST route for user to login
app.post('/login1', (req, res) => {
    //get the username and password from the request bodu
    const user = dbUsers.find(user => user.username === username && user.password === password);
    
    //if user is found, return the user object
    if (user) {
      res.send(user);
    } else {
      // is user is not found, return an error message
      res.send({ error: "User not found" });
    }
    
});

app.post('/login', (req, res) => {
  let data = req.body
  let user = login(data.username, data.password);
  res.send(
    generateToken(user)
  );
});



function login(username, password){
  console.log("someone try to login with", username, password)
  let matched = dbUsers.find(element => 
      element.username == username
  )
  if(matched) {
      if(matched.password == password) {
          return matched
      } else {
          return "Password not matched"
      }

  } else {
      return "Username not found"
  }
  
}

function register(newusername, newpassword, newname, newemail){
  //TODO: check if username exist

  dbUsers.push({
      username: newusername,
      password: newpassword,
      name: newname,
      email: newemail
  })
return "Register Succesfull"
}

//to generate JWT token
function generateToken(userProfile) {
  return jwt.sign(
    userProfile,
   'secret',
    {expiresIn :60 * 60});
}

//to verify JWT Token
function verifyToken(req, res, next) {
  let header = req.headers.authorization
  console.log(header)

  let token = header.split(' ')[1]

  jwt.verify(token, 'secret', function(err, decoded) {
    if(err) {
      res.send("Invalid Token")
    }

    req.user = decoded
    next()
  });
}
