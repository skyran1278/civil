const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const TodoSchema = {
    title: String,
    date: {
        type: Date,
        default: Date.now(),
    },
};

module.exports = mongoose.model('Todo', TodoSchema);
