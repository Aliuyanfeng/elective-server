var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var selCourseSchema = new Schema({
    sno: {
        type: Number,
        require: true
    },
    cid: {
        type: String,
        require: true
    },
    classify: {
        type: String,
        require: true
    },
    cname: {
        type: String,
        require: true
    },
    teacher: {
        type: String,
        require: true
    },
    period: {
        type: Number,
        require: true
    },
    credit: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },maxnum: {
        type: Number,
        require: true
    },
    selnum: {
        type: Number,
        require: true
    }

})

var selCourse = module.exports = mongoose.model('Selcourse', selCourseSchema)