const {validationResult} = require('express-validator');
const Movie = require('../models/movies.model')


//CRUD OPERATIONS

//## GET ALL MOVIES
const getAllMovies = async(req, res) => {
    try {

      const movies = await Movie.find().sort({createdAt: -1});

      if(movies.length === 0){
        return res.status(400).json({message:'No se encontró ninguna película'})
      }

      return res.status(200).json(movies);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error getting movies"})        
    }
}

//## GET MOVIE BY ID
const getMovieById = async(req,res) => {
  try {  
   const movie = await Movie.findById(req.params.id);

   if(!movie){
    return res.status(404).json({message:'No se encontró ninguna película'})
   }

   res.json(movie)
    
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

   //const {title, year, director, phase} = req.body;

   const newMovie = new Movie({
    title: req.body.title,
    year: req.body.year,
    director: req.body.director,
    phase: req.body.phase || 'Unknown',
   })

   const savedMovie = await newMovie.save()
   return res.status(201).json({message: '¡Pelicula creada correctamente!', data:savedMovie})
   
  } catch (error) {
   console.log(error);
   return res.status(500).json({message: error})   
  }
};

//## UPDATE MOVIE
const updateMovie = async (req,res) => {

  try {

    // Validar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      year: req.body.year,
      director: req.body.director,
      phase: req.body.phase
    },
    {
      new: true , runValidators: true
    }
  )

  if(!updatedMovie){
    return res.status(404).json({Message: "No se encontró la película"})
  }

  res.status(200).json({
    message:"Película editada!",
    data: updatedMovie
  })

  
  } catch (error) {
      console.log(error);
      res.status(500).json({message:"Error updating movie"})
  }

}

//## DELETE MOVIE
const deleteOneMovie = async (req,res) => {
  try {
    
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if(!deletedMovie){
        return res.status(404).json({message: "No se encontró la película a borrar..."})
    }

    res.status(200).json({
      message: "Película eliminada correctamente",
      data: deletedMovie,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error deleting movie"})    
  }

}

//## find movies by filters
const findMoviesByFilters = async (req,res) => {
  try {

    console.log(req.query);

    const filteredMovies = await Movie.findByFilters(req.query);   

    if(filteredMovies.length === 0){
      return res.status(404).json({message: "No se encontraron coincidencias"})
    }

    return res.json(filteredMovies)    

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