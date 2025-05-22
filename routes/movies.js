var express = require('express');
const { ValidateCreateMovie, ValidateUpdateMovie } = require('../validators/movieValidator');
const { getAllMovies, createMovie, getMovieById, updateMovie, deleteOneMovie, findMoviesByFilters } = require('../controllers/movieController');
var router = express.Router();


/* router.get('/', getAllMovies) // GET movies listing */

router.get('/', (req, res, next) => {
    if(Object.keys(req.query).length > 0){
        findMoviesByFilters(req,res, next) // si hay query params, busca por filtros
    } else {
        getAllMovies(req, res, next) // si no hay query params, devuelve todos los movies
    }
})

router.get('/:id', getMovieById) // GET one Movie by ID
router.post('/', ValidateCreateMovie, createMovie) // POST movies listing
router.put('/:id', ValidateUpdateMovie, updateMovie) // EDIT MOVIE 
router.delete('/:id', deleteOneMovie) // DELETE MOVIE

module.exports = router;
