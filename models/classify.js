var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var classifySchema = new Schema({
    cname: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        require: true
    }

})

var Classify = module.exports = mongoose.model('Classify', classifySchema)
