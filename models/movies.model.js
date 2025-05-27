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
movieSchema.statics.findByFilters = async function(filters){
    const query = {};

    if(filters.title){
        query.title = {$regex: filters.title, $options: 'i'}
    }

    if(filters.director){
        query.director = {$regex: filters.director, $options: 'i'}
    }

    if(filters.year){
        query.year = parseInt(filters.year)
    }

    if(filters.phase){
        query.phase = filters.phase;
    }

    return this.find(query);
}

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;