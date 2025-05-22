const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        trim:true
    },
    year:{
        type:Number,
        required:true,
        min: 2000,
        max: new Date().getFullYear() + 5,
    },
    director:{
        type:String,
        required:true,
        trim:true
    },
    phase:{
        type: String,
        require:true,
        enum:['Phase One', 'Phase two', 'Phase three', 'Phase Four', 'Phase Five', 'Unknown'],
        default: 'Unknown',
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }
});


//Actualizar la fecha de modificacion antes de guardar
movieSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next()
});

//aca vamos a hacer luego la logica de los filtros de busqueda

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;