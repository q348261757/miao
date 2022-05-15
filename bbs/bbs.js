const express = require("express")
const app = express()

const fs = require("fs")

const cookieParser = require('cookie-parser')

const uuid = require('uuid').v4

const port = 8090  //端口号

app.listen(port, () => {   //创建并启动服务器
  console.log('hello', port)
})

const users = JSON.parse(fs.readFileSync('./users.json'))   //读取本地注册信息并进行反序列化转为数组
const posts = JSON.parse(fs.readFileSync('./posts.json'))   //读取发帖记录
const comments = JSON.parse(fs.readFileSync('./comments.json'))  //读取所有回帖记录


app.use(express.urlencoded({extended:true})) //解析 URL-encoded 格式的请求体数据
app.use(cookieParser('aaa'))  //由种子生成cookie


app.get('/', (req, res, next) => {  //请求 获取首页
  res.type('html')
  if(req.signedCookies.loginName){  //判断是否存在cookie 即是否登录
    res.write(
      `
      <h1>welcome, ${ req.signedCookies.loginName }</h1>
      <div><a href="/">home</a></div>
      <div><a href="/logout">logout</a></div>
      <div><a href="/add-post">add-post</a></div>

      `
    )
  }else{
    res.write(
      `
      <h1>hello</h1>
      <div><a href="/">home</a></div>
      <div><a href="/login">login</a></div>
      <div><a href="/register">register</a></div>
      `
    )
  }

  for(var post of posts){
    res.write(
      `
      <div>
        <h2><a href="/post/${post.id}"> ${post.title} </a></h2>
        <p>${post.owner}</p>
      </div>
      `
    )
  }

})

app.get('/login', (req, res, next) => {   //获取登录页面
  res.type('html')
  res.end(
    `
    <h1>Login</h1>
    <form action="/login" method="post">

      <div>name:<input type="text" name="name"></div>
      <div>Password:<input type="password" name="passworld"></div>

      <button>Submit</button>
    </form>
    `
  )
})

app.post('/login', (req, res, next) => {   //登录页面发送的信息
  var loginInfo = req.body

  var target = users.find(it => it.name == loginInfo.name && it.passworld == loginInfo.passworld)   //核对是否存在账号密码  find() 方法返回数组中满足提供的测试函数的第一个元素的值

  if(target){  //target为账号密码核对结果
    res.cookie('loginName', target.name, {             //核对正确后 发送cookie
      maxAge:8640000,   //有效时间
      signed:true, //是否进行签名
    })
    res.redirect('/') //跳转到首页
    //res.end('YES')
  }else{
    res.end('XXXXX')
  }
})

app.get('/logout', (req, res, next) => {     //注销登录
  res.clearCookie('loginName')           //清除cookie
  res.redirect('/')                     //跳转到首页
})

app.get('/register', (req, res, next) => {  //获取注册页面
  res.type('html')

  res.end(
    `
    <form action="/register" method="post">
      <div>name:<input type="text" name="name"></div>

      <div>email:<input type="email" name="eamil"></div>

      <div>Password:<input type="password" name="passworld"></div>

      <div>AffirmPassword:<input type="password" name="Affirmpassworld"></div>

      <button>Submit</button>
    </form>
    `
  )
})

app.post('/register', (req, res, next) => {     //获取到注册页面发送的POST请求

  var regInfo = req.body      //解析后的请求体

  if(regInfo.passworld !== regInfo.Affirmpassworld){//判断两次输入的密码是否相同
    return res.end('passworld xx')
  }

  if(users.some(it => it.name == regInfo.name)){ //判断用户名是否被注册 some判断提供的元素是否满足提供的条件
    return res.end('name xx')
  }

  if(users.some(it => it.eamil == regInfo.eamil)){ //判断邮箱是否被注册
    return res.end('eamil xx')
  }

  res.type('html').end('yes  <a href="/login">login</a>')  //显示登录按钮

  var user = {              //注册成功后将解析后的请求体存为对象
    eamil:regInfo.eamil,
    name:regInfo.name,
    passworld:regInfo.passworld,
  }

  users.push(user)       //将请求体对象加入储存数组中

  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2))  //将对象或值转换为JSON字符串并存入本地文件

})

app.get('/add-post', (req, res, next) => {      //获取发帖页面
  res.type('html')
  res.end(
    `
    <form action="/add-post" method="post">
      Title: <br> <input type="text" name="title"> <br>
      Content: <br> <textarea type="text" name="content" cols="25" rows="6"></textarea> <br>
      <button>Post</button>
    </form>
    `
  )
})

app.post('/add-post', (req, res, next) => {   //获取到发帖页面发送的信息
  if(req.signedCookies.loginName){
    var postInfo = req.body  //获取到了发送的表单信息 请求体在前面已经被解析过
    var post = {
      id:uuid(),
      title: postInfo.title ,
      content:  postInfo.content ,
      timetamp: new Date().toISOString(), //发帖时间
      owner:req.signedCookies.loginName, //发帖人
    }
    posts.push(post)  //将记录储存
    fs.writeFileSync('./posts.json', JSON.stringify(posts, null, 2))  //写入本地文件中
    res.end('YES')

  }else{
    req.end('NO')
  }
})

app.get('/post/:id', (req, res, next) => {  //打开单个帖子的详细页面 可发布回帖
  var post = posts.find(it => it.id == req.params.id)  //判断是否存在相对应的id // req.params.id为所打开帖子的id
  res.type('html')
  if(post){  //post为find返回的一个符合id的对象
    res.write(
      `
      <h1>${post.title}</h1>
      <p>${post.content}</p>
      <span>${post.timetamp}</span>
      <a href="/user/${post.owner}">@${post.owner}</a>
      <hr>
      `
    )

    const thisComments = comments.filter(it => it.postId == req.params.id) //找出当前帖子的所有回帖信息 postid为回帖储存的主贴id ; req.params.id为主贴的id
    for(let comment of thisComments){
      res.write(
        `
        <p>${comment.content} <a href="/user/${comment.owner}">@ ${comment.owner}</a></p>
        `
      )
    }

    if(req.signedCookies.loginName){ //在登录情况下可回帖
      res.write(
        `
        <hr>
        <p>评论</p>
        <form action="/comment/${req.params.id}" method="post">
          <textarea name="content"></textarea>
          <button>提交</button>
        </form>
        `
      )}else{
      res.end(`
      <hr>
      回帖请登录`)
    }

  }else{
    res.end('noxx ')             //不存在帖子的返回
  }
})

app.post('/comment/:postId', (req, res, next) =>{     //接受回帖并储存
  var commentInfo = req.body  //请求体内容
  var postId = req.params.postId    //帖子的ID
  if(req.signedCookies.loginName){

    var comment = {                      //回帖信息
      id:uuid(),                                  //回帖的id
      content: commentInfo.content,                  //回帖内容
      timetamp: new Date().toISOString(),             //回帖事件
      owner: req.signedCookies.loginName,             //回帖账号
      postId:postId,                 //主贴的帖子ID
    }

    comments.push(comment)
    fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2))  //写入本地文件中
    res.redirect(`/post/${postId}`)  //跳转到回帖的主帖中
  }else{
    res.end('xxxx')
  }
})

app.get('/user/:userName', (req, res, next) => {       //打开用户详细页面
  var userName = req.params.userName          //req.params 为解析的get请求
  var user = users.find(it => it.name == userName)  //在注册信息中找出符合的用户信息
  res.type('html')
  if(user){
    res.write(
      `
      <img class="avatar" src="xxx">
      <h2>${userName}</h2>
      <hr>
      <h3>发帖记录</h3>
      `
    )
      var thisPosts = posts.filter(it => it.owner == userName)  //在所有的发帖记录中筛选出当前用户的发帖信息 filter 返回一个数组
      for(var post of thisPosts){
        res.write(
          `
          <a href="/post/${post.id}">${post.title}</a><br>
          `
        )
      }
      var thisComments = comments.filter(it => it.owner == userName) //在所有回帖记录中筛选出当前用户的回帖信息
      res.write(`
          <hr>
          <h2>回帖记录</h2>
      `)
      for(var Comment of  thisComments){
        res.write(`
        <div>
          <a href="/post/${Comment.postId}">帖子标题</a> <br>
          <span>${Comment.content}  </span>         <br>
          <hr>
        </div>
        `)
      }
    }else{
    res.type('html')
    res.end('用户已注销')
  }
})