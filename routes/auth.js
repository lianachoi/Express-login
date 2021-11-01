var express = require('express');
var router = express.Router();


// /* 테스트용 아이디 패스워드 */
// var authData = {
//     username: 'aaa',
//     password: 'bbb',
//     nickname: 'ccc'
// }

/* Login Process */
// router.post('/login_process', function (req, res) {
//     var post = req.body;
//     var username = post.username;
//     var password = post.password;

//     if (username === authData.username
//         && password === authData.password) {
//         // 세션을 만들어줌
//         req.session.is_logined = true;
//         req.session.nickname = authData.nickname;
//         // 로그인
//         //res.send('Welcome!');
//         req.session.save( function() {
//             res.redirect('/');    
//         })
        
//     } else{
//         // 로그인실패
//         res.send('Who are you?');
//     }
// })

/* Logout Process */
router.get('/logout_process', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');            
    })
})

/* GET home page. */
router.get('/login', function(req, res, next) {
    
    res.render('login', { title: 'test_project' });
});



module.exports = router;
