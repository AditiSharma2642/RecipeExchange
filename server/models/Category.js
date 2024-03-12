const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: 'This field is required'
    },
    image: {
        type: String,
        require: 'This field is required'
    },

});

module.exports = mongoose.model('Category', categorySchema);