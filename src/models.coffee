mongoose = require 'mongoose'

MessageSchema = new mongoose.Schema
  #userId: mongoose.Schema.ObjectId
  name: String
  timestamp:
    type: Date
    default: Date.now
  type:
    type: String
    enum: ['msg', 'joined', 'left']
  content: String
