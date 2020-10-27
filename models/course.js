var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var courseSchema = new Schema({
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
    },
    maxnum: {
        type: Number,
        require: true,
        default: 100
    },
    selnum: {
        type: Number,
        require: true,
        default: 0
    },
    introduce: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    objective: {
        type: String,
        required: true
    },
    year: {
        type: String,
        require: true
    },
    scope: {
        type: String,
        require: true
    }

})

var Course = module.exports = mongoose.model('Course', courseSchema)