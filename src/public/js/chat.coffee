$messages = $('#messages')

$ ->
  now.receiveMessage = (name, message, type) ->
    #console.log type
    switch type
      when 'joined'
        $messages.append("<li class='message-joined'>#{ name } joined the room</li>")
      when 'left'
        $messages.append("<li class='message-left'>#{ name } left the room</li>")
      else
        $messages.append("<li class='message-msg'>#{ name }: #{ message }</li>")

  $('#enter-room').submit (e) ->
    e.preventDefault()
    now.name = $('#name').val()
    now.enterRoom now.name
    $(@).hide()
    $('#chat-room').show()

  $('#send-message').submit (e)->
    e.preventDefault()
    now.distributeMessage $('#text-input').val()

  now.receiveTemplate = (template) ->
    #console.log template
