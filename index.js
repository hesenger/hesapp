const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const rateLimit = require('express-rate-limit')

// setup reqs limit to api
const apiLimit = rateLimit({ windowMs: 60 * 1000, max: 6 })
app.use('/api/', apiLimit)


// setup builded reactjs ui to be served from root
app.use(express.static('ui/build'))

app.get('/api/gettime', (req, res) => {
  res.send('Server time: ' + new Date().toLocaleTimeString())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
