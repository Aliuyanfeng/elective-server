var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var moduleAnalyseSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        require: true
    }

})

var moduleAnalyse = module.exports = mongoose.model('Moduleanalyse', moduleAnalyseSchema)