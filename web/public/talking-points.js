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

      $userSelector.chosen();
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

  var submitTalkingPoint = function(){
    var userId = $('#user-selector').val();
    var talkingPoint = $('#talking-point').val();

    if(userId && talkingPoint){
      $.ajax({
        url: '/talking-points/new',
        data: {userId: userId, talkingPoint: talkingPoint},
        success: updateUserInfo
      });
    }
  };


  $('#submit-point').click(submitTalkingPoint);
  $('#talking-point').keydown(function(e){
    if(e.keyCode == 13){
      e.preventDefault();
      submitTalkingPoint(0);
    }
  });


  $('#talking-points').click(function(e){
    var $target = $(e.target);

    if($target.hasClass('close')){
      var index = $('#talking-points').find('li').index($target.parent());
      var userId = $('#user').find('h3').data('id');

      $.ajax({
        url: '/talking-points/destroy',
        data: {userId: userId, index: index},
        success: updateUserInfo
      });
    }
  });
});


var updateUserInfo = function(user){
  var userTemplate = [
    '<h3 data-id=',
    user._id,
    '>',
      user.firstName + ' ' + user.lastName,
    '</h3>',
    '<div class="pic" style="background-image:url(\'',
    'https://junkdrawer.barkleyus.com/info/emppics/',
      user.lastName,
      ', ',
      user.firstName,
      '.jpg\')">',
    '</div>'
  ].join('');

  var photos = '';
  if(user.photos){
    user.photos.forEach(function(photo){
      var template = [
        '<li>',
          '<img src="' + photo.replace('faces/', '') + '" />',
        '</li>'
      ].join('');

      photos += template;
    });
  }

  var talkingPoints = '';
  if(user.talkingPoints){
    user.talkingPoints.forEach(function(point){
      var template = [
        '<li>',
           point,
           '<a class="close">&times;</a>',
        '</li>'
      ].join('');
      talkingPoints += template;
    });
  }

  $('#face-photos').html(photos);
  $('#talking-points').html(talkingPoints);
  $('#user').html(userTemplate);
};
