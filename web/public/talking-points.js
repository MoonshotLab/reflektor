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
        success: updateUserInfo
      });
    }
  });


  $('#talking-points').click(function(e){
    var $target = $(e.target);

    if($target.hasClass('close')){
      var index = $('#talking-points').find('li').index($target.parent());
      var userId = $('#user').find('h2').data('id');

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
    '<h3 data-id="',
    user._id,
    '">',
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

  console.log(userTemplate)

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

  $('#talking-points').html(talkingPoints);
  $('#user').html(userTemplate);
};
