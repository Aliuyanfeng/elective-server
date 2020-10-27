var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var instituteSchema = new Schema({
    iname: {
        type: String,
        require: true,
    }

})

var Institute = module.exports = mongoose.model('Institute', instituteSchema)


// var institues = ['软件学院', '艺术设计学院', '电子工程学院', '商学院']
// var iinstitutes = new Array()
// for (var i = 0; i < institues.length; i++) {
//     let institute = new Institute({
//         iname: institues[i]
//     })
//     iinstitutes.push(institute)
// }
// Institute.insertMany(iinstitutes)