const { bool } = require('@hapi/joi');
const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
        },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }});
    
    module.exports = mongoose.model('Todo',todoTaskSchema);