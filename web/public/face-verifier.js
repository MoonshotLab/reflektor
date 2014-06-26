var loadNewPhoto = function(){
  $.ajax({
    url: '/get-random-photo-in-queue',
    success: function(data){
      var photoPath = data.path.replace('photo-queue', '');
      $('#photo').data('queue-id', data._id);
      $('#photo').css('background-image', 'url(' + photoPath + ')');
    }
  });
};


$(function(){

  var $userSelector = $('#user-selector');
  $.ajax({
    url: '/all-users',
    success: function(users){
      users.forEach(function(user){
        var selectItem = createSelectTemplate(user);
        $userSelector.append(selectItem);
      });

      $userSelector.chosen();

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

  $('#skip').click(loadNewPhoto);

});
