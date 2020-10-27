var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var majorSchema = new Schema({
    mname: {
        type: String,
        require: true,
    },
    iname: {
        type: String,
        require: true,
    }

})

var Major = module.exports = mongoose.model('Major', majorSchema)


var nmajor = new Major({
    mname:'test',
    iname:'test'
})
nmajor.save()