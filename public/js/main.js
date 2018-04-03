
var name = "";
var socket = "";

$(function(){

  handleButtonEvents();
  handleEnterButton();

});

function handleEnterButton() {

    $('input').keyup(function(event) {
      if (event.keyCode == 13) {

        if(this.id == "input_name"){
          join();
        }
        else if(this.id == "input_message") {
          send();
        }
      }

    });
}

function initialize() {
  $('#prompt_name_container').show();
  $('#message_container').hide();
}

function clearText() {
  $('#input_message').val('');
}

function showChatScreen() {
  $('#prompt_name_container').hide();
  $('#message_container').show();
}

function handleButtonEvents() {

  $('button').click(function(){

    if(this.id == 'btn_login'){
      join()
    }
    else if (this.id == 'btn_send') {
      send();
    }
    else if(this.id == 'btn_close') {
      leave();
    }

  });
}

function createSocketConnection() {

    socket = io();

    socket.on('message', function(data){

      console.log("# sender : "+data.sender);
      console.log("# message : "+data.text);

      if(name == data.sender){
        postToChat(data.sender, data.text, true);
      }
      else {
          postToChat(data.sender, data.text, false);
      }

      clearText();
    });

    socket.on('online', function(data){

      showChatScreen()
      console.log("# ONLINE "+data.text);
      postToChat(data.sender, data.text, false);
    });

    socket.on('disconnect', function(user){

    });
}

function send() {

  console.log($('#input_message').val().trim().length);
  if($('#input_message').val().trim().length <= 0){
    return;
  }
  else {
    var message = $('#input_message').val();
    var obj = {sender: name, text: message};
    publish('message', obj);
  }
}

function join() {
  if($('#input_name').val().trim().length == 0) {
    alert('Enter Your Name');
  }
  else {
    name = $('#input_name').val().trim();
    createSocketConnection()
    name = capitalizeFirstLetter(name);
    publish('authentication', {username:name});
  }

}

function publish(eventName, obj) {
  socket.emit(eventName, obj);
}

function postToChat(sender, message, isMe) {
  if(isMe == true) {

    var completeText = message;
    $('#messages').append($('<li class="text-right">').html(completeText).css('background-color', '#2ecc71').css('color','white').css('font-style', 'bold'));
  }
  else {
    var completeText = '<span class="name"><strong>' + sender + '</strong></span>'+":  "+message;
    $('#messages').append($('<li>').html(completeText));

  }

}

function leave() {
  name = "";
  socket = "";
  console.log("Logout");
  initialize();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
