const {validationResult} = require('express-validator');
const fs = require('fs-extra');
const path = require('path');
const {v4: uuidv4} = require('uuid');


const moviesPath = path.join(__dirname, '../data/movies.json');

const readMovies = async() => {
    const data = await fs.readFile(moviesPath, 'utf-8');    
    return data; // Parsear el Buffer a JSON
}

const writeMovies = async(data) => {
  await fs.writeJson(moviesPath, data);
};

//CRUD OPERATIONS

//## GET ALL MOVIES
const getAllMovies = async(req, res) => {
    try {

     const movies = await readMovies();
     res.status(200).json(JSON.parse(movies));   
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error getting movies"})        
    }
}

//## GET MOVIE BY ID
const getMovieById = async(req,res) => {
  try {  
    const movies = await readMovies();
    //parsear movies
    const parsedMovies = JSON.parse(movies);

    const movie = parsedMovies.find(m => m.id === req.params.id);

    if(!movie){
      return res.status(404).json({message: "movie not found :("})
    }
    
    res.status(200).json(movie);
    
  } catch (error) {
      console.log(error);
      res.status(500).json({message:"Error getting movie"})
  }
}

//## CREATE MOVIE
const createMovie = async (req, res, next) => {
  // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const movies = await readMovies();
    const parsedMovies = JSON.parse(movies);
    console.log(parsedMovies);

    const newMovie = {
      id: uuidv4(),
      title: req.body.title,
      year: req.body.year,
      director: req.body.director,
      phase: req.body.phase || 'Unknown' // Valor por defecto
    };
    
    parsedMovies.push(newMovie);
    await writeMovies(parsedMovies);
    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
};

//## UPDATE MOVIE
const updateMovie = async (req,res) => {

  try {

    // 1 - Seteamos la info que vamos a usar
    const {id } = req.params;
    const {title, year, director, phase} = req.body;
    const movies = await readMovies();
    const parsedMovies = JSON.parse(movies);

    // 2 - Buscar el indice de la pelicula a modificar
    const index = parsedMovies.findIndex(m => m.id === id);

    // 3 -  validamos si existe la pelicula
    if(index === -1){
      return res.status(404).json({meesage: "Movie not found"})
    }

    // 4 - validar errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }

    // 5 - actualizar la película
    const updatedMovie ={
       ...parsedMovies[index],
       title: title || parsedMovies[index].title,
       year: year || parsedMovies[index].year,
       director: director || parsedMovies[index].director,
       phase: phase || parsedMovies[index].phase
    }
    
    // 6 - Reemplazar la película en el array
    parsedMovies[index] = updatedMovie;
    await writeMovies(parsedMovies)

    res.status(200).json(updatedMovie);

  } catch (error) {
      console.log(error);
      res.status(500).json({message:"Error updating movie"})
  }

}


//## DELETE MOVIE
const deleteOneMovie = async (req,res) => {
  try {
    const {id} = req.params;
     const movies = await readMovies();
     const parsedMovies = JSON.parse(movies);

    // 2 - Buscar el indice de la pelicula a modificar
    const index = parsedMovies.findIndex(m => m.id === id);

    // 3 -  validamos si existe la pelicula
    if(index === -1){
      return res.status(404).json({meesage: "Movie not found"})
    }

    // 4 - eliminar la película
    const deletedMovie = parsedMovies.splice(index, 1);
    await writeMovies(parsedMovies)

    res.status(200).json(deletedMovie[0]);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error deleting movie"})    
  }

}

//## find movies by filters
const findMoviesByFilters = async (req,res) => {
  try {
     const movies = await readMovies();
     const parsedMovies = JSON.parse(movies);

     let filteredMovies = [...parsedMovies];
   
     // Filtros
    if (req.query.title) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.title.toLowerCase().includes(req.query.title.toLowerCase())
      );
    }
    if (req.query.year) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.year === parseInt(req.query.year)
      );
    }
    if (req.query.phase) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.phase.toLowerCase() === req.query.phase.toLowerCase()
      );
    }

      res.status(200).json(filteredMovies);

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error finding movies"})    
  }
}



module.exports = {
    getAllMovies,
    createMovie,
    getMovieById,
    updateMovie,
    deleteOneMovie,
    findMoviesByFilters
}