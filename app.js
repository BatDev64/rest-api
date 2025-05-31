const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json()) // Middleware to parse JSON bodies
app.disable('x-powered-by')

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'https://example.com',
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, origin)
    }

    if (!origin) {
      // Allow requests with no origin (like curl or Postman)
      return callback(null, true)
    }

    return callback(new Error('CORS policy violation: Origin not allowed'))
  }
}))
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'https://example.com',
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, origin)
    }

    if (!origin) {
      // Allow requests with no origin (like curl or Postman)
      return callback(null, true)
    }

    return callback(new Error('CORS policy violation: Origin not allowed'))
  }
}))
// const ACCEPTED_ORIGINS = [
//   'http://localhost:3000',
//   'https://example.com',
// ]

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.get('/movies', (req, res) => {
  // const origin = req.header('origin')
  //
  // if(ACCEPTED_ORIGINS.includes(origin)) { 
  //   res.header('Access-Control-Allow-Origin', origin)
  // }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movie = movies.find(movie => movie.id === id)

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  res.json(movie)
})

app.get('/movies/genre/:genre', (req, res) => {
  const { genre } = req.params

  const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))

  if (filteredMovies.length === 0) {
    return res.status(404).json({ message: 'No movies found for this genre' })
  }
  res.json(filteredMovies)
})


app.post('/movies', (req, res) => {


  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message)
    })
  }

  const newId = crypto.randomUUID()

  const newMovie = {
    id: newId,
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: JSON.parse(result.error.message)
    })
  }
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex < 0) {
    return res.status(404).json({
      message: 'Movie not found'
    })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
