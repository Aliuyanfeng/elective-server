var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var articleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    ctime: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    },
    mcontent: {
        type: String,
        require: true
    },
    read: {
        type: Number,
        require: true,
        default: 0
    }

})

var Article = module.exports = mongoose.model('Article', articleSchema)
