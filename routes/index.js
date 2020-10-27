const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user.js')
const Classify = require('../models/classify.js')
const Course = require('../models/course.js')
const Module = require('../models/module.js')
const selCourse = require('../models/selCourse.js');
const classify = require('../models/classify.js');
const cAnalyse = require('../models/classifyAnalyse.js');
const mAnalyse = require('../models/moduleAnalyse.js')

const secret = 'mes_qdhd_mobile_xhykjyxgs';

router.get('/', function (req, res, next) {
  res.render('index', {
    title: '欢迎访问我的接口'
  });
});
//学生请求登陆
router.post('/login', async function (req, res, next) {
  // console.log(req.headers)
  await User.findOne({
    sno: req.body.sno,
    password: req.body.password
  }, function (err, user) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.json({
        status: 1,
        msg: '账号或密码错误'
      })
    }
    const {
      _id,
      username
    } = user

    const token = jwt.sign({
      _id,
      username
    }, secret, {
      expiresIn: 60 * 1
    })

    res.json({
      status: 0,
      msg: 'login is success',
      token: token,
      user: user
    })
  })
})

//获取所有课程
router.get('/getAllCourse', async (req, res, next) => {
  await Course.find((err, data) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'all is ok',
      courses: data
    })
  })
})

//选择课程
router.post('/selectCourse', (req, res, next) => {
  var classify = req.body.classify.slice(0, 2)
  var modulename = req.body.classify.slice(3).slice(0, -1)
  console.log(modulename)
  console.log(req.body.cid)
  console.log(classify)
  mAnalyse.findOne({
    name: modulename
  }, (err, module) => {
    if (err) {
      return next(err)
    }
    console.log(module)
    module.value += 1
    mAnalyse.updateOne({
      name: module.name
    }, {
      value: module.value
    }, (err) => {
      if (err) {
        return next(err)
      }
    })
  })

  cAnalyse.findOne({
    name: classify
  }, (err, classify) => {
    if (err) {
      return next(err)
    }
    // console.log(classify)
    classify.value += 1
    cAnalyse.updateOne({
      name: classify.name
    }, {
      value: classify.value
    }, (err) => {
      if (err) {
        return next(err)
      }
    })
  })
  Course.findOneAndUpdate({
    cid: req.body.cid
  }, {
    selnum: req.body.selnum += 1
  }, (err, data) => {
    if (err) {
      return next(err)
    }
    var courseinfo = new selCourse(req.body)
    courseinfo.save(function (err) {
      if (err) {
        return next(err)
      }
      res.json({
        status: 0,
        msg: 'is ok!'
      })
    })

  })

})

//获取已选择得课程

router.get('/getSelectedCourse/:sno', (req, res, next) => {
  // console.log(req.params.sno)
  selCourse.find({
    sno: req.params.sno
  }, (err, data) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'ok',
      selCourse: data
    })
  })
})

//删除已选课程
router.post('/delSelectedCourse', (req, res, next) => {
  var classify = req.body.classify.slice(0, 2)
  var module = req.body.classify.slice(3).slice(0, -1)
  console.log(module)
  // console.log(classify)
  mAnalyse.findOne({
    name: module
  }, (err, module) => {
    if (err) {
      return next(err)
    }
    console.log(module)
    module.value -= 1
    mAnalyse.updateOne({
      name: module.name
    }, {
      value: module.value
    }, (err) => {
      if (err) {
        return next(err)
      }
    })
  })

  cAnalyse.findOne({
    name: classify
  }, (err, data) => {
    if (err) {
      return next(err)
    }
    console.log(data)
    data.value -= 1
    cAnalyse.updateOne({
      name: data.name
    }, {
      value: data.value
    }, (err) => {
      if (err) {
        return next(err)
      }
    })
  })
  selCourse.findOneAndDelete({
    sno: req.body.sno,
    cid: req.body.cid
  }, (err, course) => {
    if (err) {
      return next(err)
    }
  })
  Course.findOneAndUpdate({
    cid: req.body.cid
  }, {
    selnum: req.body.selnum -= 1
  }, (err, data) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'de is ok'
    })
  })
})

//获取分类选课数据
router.get('/getClassifyData', (req, res, next) => {
  cAnalyse.find((err, classify) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'classifydata is ok',
      classify: classify
    })
  })
})

//获取模块选课数据
router.get('/getModuleData', (req, res, next) => {
  mAnalyse.find((err, module) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'moduledata is ok',
      module: module
    })
  })
})

//获取学生信息
router.get('/getStudentInfo/:sno', (req, res, next) => {
  console.log(req.params.sno)
  User.findOne({
    sno: req.params.sno
  }, (err, user) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'is ok',
      student: user
    })
  })
})





module.exports = router;