const { z } = require('zod');

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required',
  }),
  year: z.number().int().positive().min(1900).max(2099),
  director: z.string({
    invalid_type_error: 'Director must be a string',
    required_error: 'Director is required',
  }),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5.5),
  genre: z.array(z.enum([
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Sci-fi',
    'Fantasy',
    'Horror',
    'Thriller',
    'Animation',
    'Documentary',
    'Romance',
    'Crime',
    'Mystery',
    'Biography',
    'Family',
    'Musical',
    'War',
    'Western',
    'History',
    'Sport'
  ], {
    required_error: 'Movie genre is required',
    invalid_type_error: 'Movie genre must be an array of enum Genre',
  })),
  poster: z.string().url({
    message: 'Poster must be a valid URL',
  }),
})

function validateMovie(input) {
  return movieSchema.safeParse(input);
}

function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input);
}
module.exports = {
  movieSchema,
  validateMovie,
  validatePartialMovie
}
