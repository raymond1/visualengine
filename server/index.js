const express = require('express')
const app = express()
const port = 9000

app.use(express.static('client'))
app.listen(port, () => console.log(``))
