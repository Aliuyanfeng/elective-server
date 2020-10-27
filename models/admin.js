var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var adminSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isSuper: {
        type: Number,
        require: true
    }
})


var Admin = module.exports = mongoose.model('Admin', adminSchema)
