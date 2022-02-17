const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
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
    ].join(' ');
  })
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * 1000000) : 0;
  return maxId + 1;
};

app.get('/info', (request, response) => {
  const message = `
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `;
  response.send(message);
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  const hasDuplicatedName = Boolean(persons.find((p) => p.name === name));

  if (!name || !number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    });
  }
  if (hasDuplicatedName) {
    return response.status(400).json({
      error: 'The name already exists in the phonebook'
    });
  }
  const person = {
    id: generateId(),
    name,
    number
  };

  response.json(persons.concat(person));
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) return response.status(204).end();
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
