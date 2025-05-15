const {body} = require('express-validator');

const titleValidator = body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({min:2, max:100}).withMessage('Title must be between 2 and 100 characters long');

const yearValidator = body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({min:2000, max:2030}).withMessage('Year must be an integer and between 2000 and 2030')    

const directorValidator = body('director')
    .notEmpty().withMessage('Director is required')
    .isString().withMessage('Title must be a string')    
    .trim()


const phaseValidator = body('phase')    
    .optional()
    .isString().withMessage('Phase must be a string')
    .isIn(["Phase One", "Phase Two", "Phase Three", "Phase Four"]).withMessage
    ('Phase must be one of the following: Phase One, Phase Two, Phase Three, Phase Four')

//validaciones para el create
exports.ValidateCreateMovie = [
    titleValidator,
    yearValidator,
    directorValidator,
    phaseValidator
]  

//validaciones para el update
exports.ValidateUpdateMovie = [
    titleValidator.optional(),
    yearValidator.optional(),
    directorValidator.optional(),
    phaseValidator
]