fs = require 'fs'
path = require 'path'
express = require 'express'

routes = require './routes'

app = module.exports = express.createServer()

app.configure ->
  app.set 'views', path.join __dirname, 'views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static path.join __dirname, 'public'

app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true

app.configure 'production', ->
  app.use express.errorHandler()

app.get '/', routes.index

everyone = require('now').initialize app

everyone.now.distributeMessage = (message) ->
  everyone.now.receiveMessage @now.name, message

everyone.now.fetchTemplate = (template) ->
  fs.readFile path.join(app.settings.views, path.normalize(template)), (err, data) =>
    if err then throw err else @now.receiveTemplate data.toString 'ascii'


port = process.env.PORT or 3000

app.listen port, ->
  console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
