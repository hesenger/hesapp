const express = require('express')
const app = express()
const rateLimit = require('express-rate-limit')
const https = require('https')
const jwt = require('express-jwt')
const token = require('jsonwebtoken')
const MongoClient = require('mongodb').MongoClient

const port = process.env.PORT || 3000
const secret = process.env.JWT_SECRET || 'place-production-secret-heroku-vars'
const mongoUri = process.env.MONGO_URI

const client = new MongoClient(mongoUri, { useNewUrlParser: true });
client.connect(err => {
  if (err) {
    console.log(err)
    return
  }

  client.close()
})

// setup reqs limit to api
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 6 }))
app.use('/login', rateLimit({ windowMs: 60 * 1000, max: 3 }))

// setup builded reactjs ui to be served from root
app.use(express.static('ui/build'))

app.get('/api/info', async (req, res) => {
  https.get('https://api.ipify.org?format=json', ip => {
    let body = '';
    ip.on('data', d => body += d);
    ip.on('end', () => {
      const json = JSON.parse(body);
      const content = `Server time: ${new Date()}<br/>`
        + `Server IP: ${json.ip}`;
      res.send(content);
    })
  })
})

app.post('/login', (req, res) => {
  const { uid, pwd } = req.body;
  const content = token.sign({ uid }, secret)
  res.json(content)
})

app.get('/protected',
  jwt({ secret, algorithms: ['HS256'] }),
  (req, res) => {
    if (!req.user.admin) return res.sendStatus(401);
    res.sendStatus(200);
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
