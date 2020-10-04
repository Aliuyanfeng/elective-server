var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/elective', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


var Schema = mongoose.Schema

var moduleSchema = new Schema({
    mname: {
        type: String,
        require: true
    },
    pname: {
        type: String,
        require: true
    }

})

var Module = module.exports = mongoose.model('Module', moduleSchema)
// var arr = [{
//     mname: '工程方法与系统',
//     pname: '工程'
// },{
//     mname: '创新方法与实践',
//     pname: '工程'
// }]
// var arrs = new Array()
// for (var i = 0; i < arr.length; i++) {
//     let module = new Module({
//         mname: arr[i].mname,
//         pname: arr[i].pname
//     })
//     arrs.push(module)
// }
// Module.insertMany(arrs,(err)=>{
//     if(err){
//         console.log(err)
//     }
//     console.log('模块初始化成功')
// })