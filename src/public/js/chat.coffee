$ ->
  now.receiveMessage = (name, message) ->
    $('#messages').append("<li>#{ name }: #{ message }</li>")

  $('#send-button').click ->
    now.distributeMessage $('#text-input').val()

  $('#text-input').val('')

  now.name = prompt 'What is your name?'

  now.receiveTemplate = (template) ->
    console.log template
