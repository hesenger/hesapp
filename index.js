const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('app/build'))

app.get('/', (req, res) => {
  res.send('server time: ' + new Date().toLocaleTimeString())
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
