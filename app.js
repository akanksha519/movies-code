const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
const dbPath = path.join(__dirname, 'moviesData.db')

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

/* get movies API */
const convertDbObjectToResponseObject = dbObject => {
  return {
    movieName: dbObject.movie_name,
  }
}

app.get('/movies/', async (request, response) => {
  const getMoviesQuery = `
 SELECT
 movieName
 FROM
movie;`
  const moviesArray = await database.get(getMoviesQuery)
  response.send(
    moviesArray.map(eachMovie => convertDbObjectToResponseObject(eachMovie)),
  )
})

/* create movie API */

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `
    INSERT INTO
    movie (director_id,movie_name,lead_actor)
    VALUES('${directorId}','${movieName}','${leadActor}');`

  const dbResponse = await db.run(addMovieQuery)
  const movieId = dbResponse.lastID
  response.send('Movie Successfully Added')
})

/* get movie API */

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `
  SELECT * FROM
  movie
  WHERE 
  movie_id=${movieId};
  `
  const movie = await db.get(getMovieQuery)
  const {movie_id, director_id, movie_name, lead_actor} = movie
  const dbResponse = {
    movieId: movie_id,
    directorId: director_id,
    movieName: movie_name,
    leadActor: lead_actor,
  }
  response.send(dbResponse)
})

/* update movie API */
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updateMovieQuery = `
  UPDATE movie
  SET 
  director_id='${directorId}',
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  WHERE movie_id=${movieId};`
  await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

/* delete movie API */
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `
  DELETE 
  FROM movie
  WHERE 
  movie_id=${movieId};`
  await db.run(deleteMovieQuery)
  response.send('Movie Removed')
})

/* Get Directors API  */
const convertDbObjectToResponse2Object = dbObject => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  }
}
app.get('/directors/', async (request, response) => {
  const getDirectorsQuery = `
 SELECT
 *
 FROM
 director;`
  const directorsArray = await db.all(getDirectorsQuery)
  response.send(
    directorsArray.map(eachDirector =>
      convertDbObjectToResponse2Object(eachDirector),
    ),
  )
})

/* get movie names API */
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getmovieNamesQuery = `
  select movie_name 
  from 
  movie
  where director_id=${directorId};
  `
  const movieNamesArray = await db.all(getmovieNamesQuery)
  response.send(movieNamesArray)
})

module.exports = app
