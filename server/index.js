import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import path from 'node:path'
import expressId from 'express-request-id'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

const port = 3000

const token = 'f8792bn109_bh32jh989^81'

// db.json file path
const file = path.join(__dirname, `db_${new Date().getTime()}.json`)

// Configure lowdb to write data to JSON file
const defaultData = { surveys: [] }
const db = new Low(new JSONFile(file), defaultData)

// If you don't want to type db.data everytime, you can use destructuring assignment
const { surveys } = db.data

morgan.token('id', (req) => req.id.split('-')[0])

app.use(expressId({setHeader: false}))
app.use(morgan('[:date[iso] #:id] Started :method :url for :remote-addr', {immediate: true}))
app.use(morgan('[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms'))

app.use('/fairness-userstudy', express.static(path.join(__dirname, './build')))

app.use(bodyParser.json())

app.post('/survey', async (req, res) => {
  if (req.body.auth !== token) {
    res.status(400)
    res.send('Invalid reuqest')
  } else if (!req.body.survey) {
    res.status(400)
    res.send('No survey')
  }else {
    surveys.push(req.body.survey)
    await db.write()
    res.send('OK')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
