var express = require('express');
var router = express.Router();

function authIsOwner(req, res) {
  if (req.user) {
    return true;
  } else {
    return false;
  }
}

function authStatusUI(req, res, uiInfo) {
  if (authIsOwner(req,res)) {
    uiInfo.nickname = req.user.nickname;
    uiInfo.link = 'http://localhost:3000/auth/logout_process';
    uiInfo.link_name = '로그아웃'
  }
  return uiInfo;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  // // 쿠키 생성
  // res.cookie('loginCookie','set Cookie');

  // // 쿠키 읽기
  // console.log(req.cookies);
  // // 세션 읽기
  //console.log(req.session);
  var uiInfo={};
  uiInfo.title = 'test_project';
  uiInfo.link = 'http://localhost:3000/auth/login';
  uiInfo.link_name = '로그인'
  uiInfo = authStatusUI(req, res, uiInfo);
  res.render('index', uiInfo);
});

module.exports = router;
