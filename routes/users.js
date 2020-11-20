const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const admin = require('../models/admin')
const classify = require('../models/classify')
const modules = require('../models/module')
const Course = require('../models/course')
const Article = require('../models/article');
const article = require('../models/article');
const User = require('../models/user')
const Class = require('../models/class')
const Institute = require("../models/institute");
const Major = require('../models/major');
const { route } = require('.');
const { decode } = require('iconv-lite');

const secret = 'alogin rules'

//判断权限中间件
const isSuper = async (req, res, next) => {
  const token = req.headers.authorization.split(' ').pop()
  console.log(token)
  const {
    _id,
    username
  } = jwt.verify(token, secret)
  console.log(_id)
  console.log(username)
  //查询是否存在
  const user = await admin.findById(_id)
  console.log(user)
  if (!user) {
    return res.json({
      status: 422,
      msg: "用户错误"
    })
  }
  if (username != user.username) {
    return res.json({
      status: 422,
      msg: '用户错误'
    })
  } else {
    // 存在，查看权限
    if (user.isSuper === 0) {
      res.json({
        status: 409,
        msg: "没有权限"
      })
    } else if (user.isSuper === 1) {
      next()
    }
  }

}

//判断token是否过期
const tokenVerify = async (req, res, next) => {
  const token = req.headers.authorization.split(' ').pop()
  console.log(token)
   jwt.verify(token.secret, (err, decode) => {
    if (err) {
      res.json({
        status: 403,
        msg: 'token过期'
      })
    } else {
      next()
    }
  })
}

// 管理员登陆
router.post('/alogin', async (req, res, next) => {
  // console.log(req.body)
  var user = await admin.findOne({
    username: req.body.username
  })
  // console.log(user)
  if (!user) {
    return res.json({
      status: 422,
      msg: 'find failed'
    })
  }

  if (req.body.password !== user.password) {
    return res.json({
      status: 422,
      msg: 'passwprd is error'
    })
  }

  //jwt 返回管理员的token
  const { _id, username } = user
  // console.log(_id)
  // console.log(username)

  const token = jwt.sign({
    _id,
    username
  }, secret, {
    expiresIn: '0.01h'
  })
  return res.json({
    status: 0,
    msg: 'alogin is ok ',
    token: token
  })
  // admin.findOne({
  //   username: req.body.username,
  // }, (err, data) => {
  //   if (err) {
  //     return next(err)
  //   }
  //   console.log(data)
  //   res.json({
  //     status: 0,
  //     msg: 'alogin is ok'
  //   })
  // })
});




//获取所有分类
router.get('/getAllClassify', (req, res, next) => {
  classify.find((err, classify) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'get classify is ok',
      list: classify
    })
  })
})

//获取所有模块
router.get('/getAllModule', (req, res, next) => {
  modules.find((err, modules) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'get module is ok',
      list: modules
    })
  })
})

//添加课程
router.post('/addCourse', (req, res, next) => {
  console.log(req.body)

  var course = new Course(req.body)
  course.save((err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'course save ok'
    })
  })
})

//发布文章
router.post('/write', tokenVerify, (req, res, next) => {
  console.log(req.body)
  var article = new Article(req.body)
  article.save((err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'article save ok'
    })
  })
})

//获取所有文章
router.get('/getAllArticle', (req, res, next) => {
  Article.find((err, articles) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'article is ok',
      articles: articles
    })
  })
})

//通过id获取文章
router.get('/getArticleById/:id', (req, res, next) => {
  console.log(req.params.id)
  Article.findOne({
    _id: req.params.id
  }, (err, article) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'articleById is ok',
      article: article
    })
  })
})
//更新文章
router.post("/updateArticle", (req, res, next) => {
  console.log(req.body)
  Article.findByIdAndUpdate({
    _id: req.body.id
  }, req.body, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'articleupdate is ok'
    })
  })
})

//删除文章
router.get('/delById/:id', isSuper, (req, res, next) => {
  Article.findByIdAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'del is ok'
    })
  })
})

//通过cid获取课程
router.get('/getCourseByCid/:cid', (req, res, next) => {
  var c_id = req.params.cid
  Course.findOne({
    cid: c_id
  }, (err, course) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'courseById is ok',
      course: course
    })
  })
})

//更新课程
router.post('/updateCourse', (req, res, next) => {
  console.log(req.body)
  Course.findOneAndUpdate({
    _id: req.body._id
  }, req.body, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'updatecourse is ok'
    })
  })
})


//删除课程
router.get('/delCourse/:cid', isSuper, (req, res, next) => {
  console.log(req.params.cid)
  Course.findOneAndDelete({
    cid: req.params.cid
  }, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'del is ok'
    })
  })
})


//更新分类
router.post('/updateClassify', (req, res, next) => {
  console.log(req.body)
  classify.findOneAndUpdate({
    _id: req.body._id
  }, { cname: req.body.cname }, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'updateclassify is ok'
    })
  })
})

//删除分类
router.get('/delClassify/:id', isSuper, (req, res, next) => {
  console.log(req.params.id)
  classify.findOneAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'delclassify is ok'
    })
  })
})

//新增分类
router.post('/addClassify', (req, res, next) => {
  console.log(req.body)
  var nclassify = new classify(req.body)
  nclassify.save(err => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'save is ok'
    })
  })
})

//更新模块
router.post('/updateModule', (req, res, next) => {
  console.log(req.body)
  modules.findOneAndUpdate({
    _id: req.body._id
  }, req.body, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'updatempdule is ok'
    })
  })
})

//删除模块
router.get('/delModule/:id', isSuper, (req, res, next) => {
  console.log(req.params.id)
  modules.findOneAndDelete({
    _id: req.params.id
  }, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'delmodule is ok'
    })
  })
})

//新增模块
router.post('/addModule', (req, res, next) => {
  console.log(req.body)
  var nmodule = new modules(req.body)
  nmodule.save(err => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'savemodule is ok'
    })
  })
})

//添加学生
router.post('/addStudent', (req, res, next) => {
  console.log(req.body)
  var nuser = new User(req.body)
  nuser.save(err => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'user is saved'
    })
  })
})

//获取所有学生
router.get('/getAllStudent', (req, res, next) => {
  User.find((err, students) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'studentList is ok',
      students: students
    })
  })
})

//更新学生
router.post('/updateStudent', (req, res, next) => {
  console.log(req.body)
  User.findOneAndUpdate({
    _id: req.body._id
  }, req.body, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'updatestudent is ok'
    })
  })
})

//删除学生
router.get('/delStudent/:id', isSuper, (req, res, next) => {
  console.log(req.params.id)
  User.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'is ok '
    })
  })
})

//获取所有班级
router.get('/getAllClass', (req, res, next) => {
  Class.find((err, classes) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'getallclass is ok ',
      classes: classes
    })
  })
})

//获取所有学院
router.get('/getAllInstitute', (req, res, next) => {
  Institute.find((err, institutes) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'institue is ok',
      institutes: institutes
    })
  })
})

//获取某个学院的所有专业
router.get('/getMajorByInstitute/:ins', (req, res, next) => {
  console.log(req.params.ins)
  Major.find({
    iname: req.params.ins
  }, (err, majors) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'get major is ok',
      majors: majors
    })
  })
})

//获取专业所有班级
router.get('/getClassByMajor/:major', (req, res, next) => {
  console.log(req.params.major)
  Class.find({
    mname: req.params.major
  }, (err, classes) => {
    if (err) {
      return next(err)
    }
    res.json({
      status: 0,
      msg: 'get class is ok',
      classes: classes
    })
  })
})






module.exports = router;
