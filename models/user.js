var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var userSchema = mongoose.Schema({
    sno: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: Number,
        require: true,
        default: 0
    },
    class: {
        type: String,
        require: true,
    },
    major: {
        type: String,
        require: true,
    },
    institute: {
        type: String,
        require: true
    }
})

var User = module.exports = mongoose.model('User', userSchema)
