require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
// Middleware orders matters
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
)

const Person = require('./models/person')

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    const message = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `
    response.send(message)
  })
})

app.post('/api/persons', (request, response, next) => {
  Person.find({}).then((persons) => {
    const { name, number } = request.body
    const hasDuplicatedName = Boolean(persons.find((p) => p.name === name))

    if (!name || !number) {
      return response.status(400).json({
        error: 'The name or number is missing'
      })
    }
    if (hasDuplicatedName) {
      return response.status(400).json({
        error: 'The name already exists in the phonebook'
      })
    }

    const person = new Person({
      name,
      number
    })
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => next(error))
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name,
    number
  }
  const options = {
    new: true,
    runValidators: true,
    context: 'query'
  }

  Person.findByIdAndUpdate(request.params.id, person, options)
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.log(error.errors)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response
      .status(400)
      .json({ error: error.errors[('name', 'number')].message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
