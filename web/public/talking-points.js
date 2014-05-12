$(function(){

  var $userSelector = $('#user-selector');
  $userSelector.append(createSelectTemplate());

  $.ajax({
    url: '/all-users',
    success: function(users){
      users.forEach(function(user){
        var selectItem = createSelectTemplate(user);
        $userSelector.append(selectItem);
      });
    }
  });


  $userSelector.change(function(){
    var userId = $userSelector.val();
    if(userId){
      $.ajax({
        url: '/user/' + userId,
        success: updateUserInfo
      });
    }
  });


  $('#submit-point').click(function(){
    var userId = $('#user-selector').val();
    var talkingPoint = $('#talking-point').val();

    if(userId && talkingPoint){
      $.ajax({
        url: '/talking-points/new',
        data: {userId: userId, talkingPoint: talkingPoint},
        success: function(){
          alert('Saved!');
        }
      });
    }
  });


});


var updateUserInfo = function(user){
  console.log(user);
  var template = [
    '<h2>' + user.firstName + ' ' + user.lastName + '</h2>'
  ].join('');

  $('#user').html(template);
};


var createUserTemplate = function(user){

};
