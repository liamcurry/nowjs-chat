fs = require 'fs'
path = require 'path'
express = require 'express'
nowjs = require 'now'

routes = require './routes'

app = module.exports = express.createServer()

app.configure ->
  app.set 'views', path.join __dirname, 'views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static path.join __dirname, 'public'
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true


'''
app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true

app.configure 'production', ->
  app.use express.errorHandler()
'''

app.get '/', routes.index

everyone = nowjs.initialize app

everyone.now.enterRoom = (name) ->
  everyone.now.receiveMessage name, '', 'joined'

everyone.now.distributeMessage = (message) ->
  everyone.now.receiveMessage @now.name, message, 'msg'

everyone.now.fetchTemplate = (template) ->
  fs.readFile path.join(app.settings.views, path.normalize(template)), (err, data) =>
    if err then throw err else @now.receiveTemplate data.toString 'ascii'

nowjs.on 'disconnect', ->
  nowjs.getClient @user.clientId, ->
    everyone.now.receiveMessage @now.name, '', 'left'

app.listen process.env.PORT || 3000, ->
  console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
  console.log process.version
  console.log "AWWW YEAHHHHHH"
