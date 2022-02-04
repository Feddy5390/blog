const MEMBER = require('./js/member.js')

// timer
const Timer  = require('./js/timer.js')
const _timer = new Timer

// entities
const Mario  = require('./js/entity/mario.js')
const Koopa  = require('./js/entity/koopa.js')

// express
const PORT       = 3000
const EXPRESS    = require('express')
const APP        = EXPRESS()
const SERVER     = require('http').createServer(APP)
const IO         = require('socket.io')(SERVER)
const PATH       = require('path')
const SESSION    = require('express-session')
const BODYPARSER = require('body-parser')

// mysql
// DB('SELECT * FROM `custom_level` WHERE `user_id` = \'1\'', function (error, results, fields) {
//   console.log(results)
// });
// return

let players     = {}
let playersObj  = {}
let playersCmd  = {}
let gameUpdates = {}
let rooms       = {}

IO.on('connection', socket => {
  socket.on('createRoom', userData => {
    playersObj[socket.id] = new Mario(10, 0)
    playersCmd[socket.id] = userData.keyStates
    // 遊戲物件載入
    playersObj[socket.id + 'koopa'] = new Koopa(10, 810)
  })

  // 目前都在同一房間(測試)
  socket.on('join', userData => {
    console.log('player[' + socket.id + '] join!')
    playersObj[socket.id] = new Mario(10, 0)
    playersCmd[socket.id] = userData.keyStates

    // return your socketId
    socket.emit('returnJoin', socket.id)
  })

  // 玩家準備好，遊戲開始
  socket.on('really', isReally => {
    if(Object.keys(playersObj).length > 0) {
      console.log('伺服器循環開始')
      socket.emit('gameStart', {
        't': Date.now(),
        'data': players
      })
      _timer.loop(main)
    }
  })

  socket.on('cmd', cmd => {
    playersCmd[socket.id] = cmd
  })

  socket.on('disconnect', data => {
    delete players[socket.id]
    delete playersObj[socket.id]
    delete playersCmd[socket.id]
  })

})

// game loop
function main(dt) {
  for(let socketId in playersObj) {
    playersObj[socketId].update(playersCmd[socketId], dt)
    players[socketId] = playersObj[socketId].info()
  }

  IO.emit('serverUpdate', {
    't': Date.now(),
    'data': players
  })
}



// ejs template
APP.set('view engine', 'ejs')
APP.use(EXPRESS.static(__dirname + '/../public'))

// body parser
APP.use(BODYPARSER.urlencoded({ extended: false }))
APP.use(BODYPARSER.json());

// session
APP.use(SESSION({
  secret: 'mySecret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 2400 * 1000
  }
}))

APP.get('/', (req, res) => {
  res.render('index')
})

// login process api
APP.post('/login', (req, res) => {
  if(req.session.subjectID) {
    return res.json({status: 1})
  }

  MEMBER.get(req.body.subjectID, req.body.subjectPW, (err, result) => {
    if(err) {
      return res.json({status: 0, msg: 'login error'})
    }

    if(result.length == 0) {
      return res.json({status: 0, msg: 'Invalid account ID, email or password'})
    }

    result = JSON.parse(JSON.stringify(result))
    req.session.subjectID = result[0].account
    return res.json({status: 1})
  })
})

SERVER.listen(PORT)
