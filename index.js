const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs =require('fs');
app.use(express.json())
app.use(cors());
const users = []
app.post('/api',function(req,res){
 if(req.url === '/favicon.ico'){
    res.end();
 }
 const json = fs.readFileSync('count.json','utf-8');
 const obj =JSON.parse(json);
 obj.pageviews= obj.pageviews+1;
 if(req.query.type =='visit-pageview'){
    obj.visits=obj.visits+1;
 }
  const newJSON =JSON.stringify(obj);
  fs.writeFileSync('count.json',newJSON);
  res.send(newJSON);
})
app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.get('/', (req,res)=>{
  res.send('Micros deployed')
})

app.listen(3000,()=>{
    console.log("server running on port 3000");
})

module.exports = app