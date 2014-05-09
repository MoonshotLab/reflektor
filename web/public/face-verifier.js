$(function(){

  var $userSelector = $('#user-selector');
  $.ajax({
    url: '/all-users',
    success: function(users){
      users.forEach(function(user){
        var selectItem = createSelectTemplate(user);
        $userSelector.append(selectItem);
      });

      loadNewPhoto();
    }
  });


  $('#confirm-user').click(function(){
    var queueId = $('#photo').data('queue-id');
    $.ajax({
      url: '/mark-record/' + queueId,
      success: loadNewPhoto
    });
  });

  $('#trash-photo').click(function(){
    $.ajax({
      url: '/mark-record',
      success: loadNewPhoto
    });
  });

});
