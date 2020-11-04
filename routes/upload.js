const express = require('express');
const { NotExtended } = require('http-errors');
const fs = require('fs')
const router = express.Router();
const multer = require('multer');
const node_xlsx = require('node-xlsx')
const cp = require('child_process')
const iconv = require('iconv-lite');
const Course = require('../models/course')
const User = require('../models/user')
const selCourse = require('../models/selCourse')
const { oldpath, date, newpath } = require('../routes/schedule.js')


const basePath = './uploads/'
let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var changedName = (new Date().getTime()) + '-' + file.originalname;
            cb(null, changedName);
        }
    })
});



//课程文件上传
router.post('/uploadCourse', upload.single('file'), (req, res) => {
    //解析excel文件
    let obj = node_xlsx.parse(basePath + req.file.filename);
    //获取第一个sheet
    let excelobj = obj[0].data;
    //要插入数据库的数据
    var insertData = [];
    //循环遍历每行  预设表头
    for (var i = 1; i < excelobj.length; i++) {
        //每行的数据
        var rdata = excelobj[i]
        var CourseObj = new Object();
        var CourseArray = new Array('cid', 'cname', 'teacher', 'period', 'credit', 'classify', 'address', 'maxnum', 'selnum', 'introduce', 'school', 'objective', 'year', 'scope');
        for (var j = 0; j < rdata.length; j++) {
            CourseObj[CourseArray[j]] = rdata[j]
        }
        insertData.push(CourseObj)
    }
    console.log(insertData)
    //往数据库插入
    Course.insertMany(insertData, (err, result) => {
        if (err) {
            return res.json({
                status: 200,
                message: '导入失败',
                data: err,
                returnValue: 0
            })
        }
        res.json({
            status: 0,
            type: 'single',
            path: req.file.path,
            returnValue: 1
        })
    })
    fs.unlink(req.file.path, (err) => {
        if (err) {
            throw err
        }
        console.log('删除成功')
    })
});

//学生文件上传
router.post('/uploadStudent', upload.single('file'), (req, res, next) => {

    //解析excel文件
    let obj = node_xlsx.parse(basePath + req.file.filename);
    //获取第一个sheet
    let excelobj = obj[0].data;
    //要插入数据库的数据
    var insertData = [];
    //循环遍历每行  预设表头
    for (var i = 1; i < excelobj.length; i++) {
        //每行的数据
        var rdata = excelobj[i]
        var StudentObj = new Object();
        var StudentArray = new Array('sno', 'username', 'password', 'class', 'institute', 'major');
        for (var j = 0; j < rdata.length; j++) {
            StudentObj[StudentArray[j]] = rdata[j]
        }
        insertData.push(StudentObj)
    }
    console.log(insertData)
    //往数据库插入
    User.insertMany(insertData, (err, result) => {
        if (err) {
            return next(err)
        }
        res.json({
            status: 0,
            type: 'single',
            originalname: req.file.originalname,
            path: req.file.path,
        })
    })
    fs.unlink(req.file.path, (err) => {
        if (err) {
            throw err
        }
        console.log('删除成功')
    })
});

//备份
router.get('/dataBackup', (req, res, next) => {

    cp.exec("mongodump -h 127.0.0.1:27017 -d elective -o D:\\mongodump\\ ", { encoding: 'buffer' }, (error, stdout, stderr) => {
        if (error) {
            throw error
        }
        stdout = iconv.decode(stdout, 'gbk');
        stderr = iconv.decode(stderr, 'gbk');
        console.log(stdout)
        console.log(stderr)
        fs.rename(oldpath, newpath, (err) => {
            if (err) {
                throw err
            }
            console.log('重命名完成')
        })
        res.json({
            status: 0,
            msg: 'dataBackup is ok'
        })
    })
})

//导出课程
router.get('/exportCourse', (req, res) => {
    Course.find().exec((err, data) => {
        // console.log(data)
        var datas = [];
        var title = ['课程ID', '课程名称', '任课教师', '学时', '学分', '类别', '教室', '已选人数', '课程介绍', '开办学校', '课程目标', '开办时间', '适合范围']//这是第一行 俗称列名
        datas.push(title);
        data.forEach((item) => {
            var arrInner = [];
            arrInner.push(item.cid);
            arrInner.push(item.cname);
            arrInner.push(item.teacher);
            arrInner.push(item.period);
            arrInner.push(item.credit);
            arrInner.push(item.classify);
            arrInner.push(item.address);
            arrInner.push(item.selnum);
            arrInner.push(item.introduce);
            arrInner.push(item.school);
            arrInner.push(item.objective);
            arrInner.push(item.year);
            arrInner.push(item.scope);

            datas.push(arrInner);//data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
        });
        var name = GetDateStr() + '公选课信息' + '.xlsx';
        writeExcel(name, datas);
        res.download('./uploads/' + name);
    });
});

//导出学生
router.get('/exportStudent', (req, res) => {
    User.find().exec((err, data) => {
        // console.log(data)
        var datas = [];
        var title = ['学号', '姓名', '密码', '班级', '专业', '学院']
        datas.push(title);
        data.forEach((item) => {
            var arrInner = [];
            arrInner.push(item.sno);
            arrInner.push(item.username);
            arrInner.push(item.password);
            arrInner.push(item.class);
            arrInner.push(item.major);
            arrInner.push(item.institute);

            datas.push(arrInner);
        });
        var name = GetDateStr() + '学生信息' + '.xlsx';
        writeExcel(name, datas);
        res.download('./uploads/' + name);
    });
});

//导出已选课程
router.get('/exportSelcourse', (req, res) => {
    selCourse.find().exec((err, data) => {
        // console.log(data)
        var datas = [];

        var title = ['课程ID', '课程名称', '任课教师', '分类', '地址', '学号']
        datas.push(title);
        data.forEach((item) => {
            var arrInner = [];
            arrInner.push(item.cid);
            arrInner.push(item.cname);
            arrInner.push(item.teacher);
            arrInner.push(item.classify);
            arrInner.push(item.address);
            arrInner.push(item.sno);

            datas.push(arrInner);
        });
        var name = GetDateStr() + '已选课程' + '.xlsx';
        writeExcel(name, datas);
        res.download('./uploads/' + name);
    });
});


//写入到文件夹
function writeExcel(name, data) {
    var buffer = node_xlsx.build([{ name: 'sheet1', data: data }]);
    fs.writeFileSync('./uploads/' + name, buffer, { 'flag': 'w' });
}
//获取日期
function GetDateStr() {
    return new Date().toJSON().slice(0, 10)
}



module.exports = router;