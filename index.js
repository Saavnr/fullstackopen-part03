const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', (request, response) => {
  const body = JSON.stringify(request.body)
  if (request.method == 'POST') {
    return body
  }
  return null
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>fullstackopen-part3</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const personsInfo = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `
  response.send(personsInfo)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(person) {
    return response.send(person)
  }
  response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random()*1000000).toString()
  const {name, number} = request.body
  const newPerson = {id, name, number}

  if(!name || !number) {
    return response.status(400).json({error: 'content missings'})
  } else if(persons.find(person => person.name === name)) {
    return response.status(400).json({error: 'name must be unique'})
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})