var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var classSchema = new Schema({
    cname: {
        type: String,
        require: true
    },
    mname: {
        type: String,
        require: true
    },
    iname: {
        type: String,
        require: true,
    }

})

var Class = module.exports = mongoose.model('Class', classSchema)

var classes = ['软件17H02', '软件17H03']