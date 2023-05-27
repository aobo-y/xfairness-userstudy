import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import {default as _} from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import path from 'node:path'
import fs from 'node:fs'
import expressId from 'express-request-id'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
var args = process.argv.slice(2);

const QUESTION_NUM = 1

const app = express()

const port = args.length ? args[0] : 80

const token = 'f8792bn109_bh32jh989^81'

const contextData = {}
const dataFolder = './data'
fs.readdirSync(dataFolder).forEach(file => {
  contextData[file.replace(/\.json$/, '')] = JSON.parse(
    fs.readFileSync(path.join(dataFolder, file))
  )
});

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

app.use('/xfairness-userstudy', express.static(path.join(__dirname, './build')))

app.use(bodyParser.json())

app.get('/context/:key', async (req, res) => {
  const key = req.params.key
  if (key in contextData) {
    const context =  _.sampleSize(contextData[key], QUESTION_NUM).map(pairs => _.shuffle(pairs))
    res.send(context)
  } else {
    res.status(400)
    res.send('Not found')
  }
})

app.post('/survey', async (req, res) => {
  if (req.body.auth !== token) {
    res.status(400)
    res.send('Invalid reuqest')
  } else if (!req.body.survey) {
    res.status(400)
    res.send('No survey')
  } else {
    surveys.push(req.body.survey)
    await db.write()
    res.send('OK')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
