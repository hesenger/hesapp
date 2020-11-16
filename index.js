const express = require('express')
const app = express()
const rateLimit = require('express-rate-limit')
const https = require('https')

const port = process.env.PORT || 3000
const secret = process.env.JWT_SECRET || 'place-production-secret-heroku-vars';

// setup reqs limit to api
const apiLimit = rateLimit({ windowMs: 60 * 1000, max: 6 })
app.use('/api/', apiLimit)


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
    });
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
