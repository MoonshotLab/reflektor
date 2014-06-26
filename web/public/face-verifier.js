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
    var userId = $userSelector.val();
    $.ajax({
      url: '/assign-queue-item/' + queueId + '?userId=' + userId,
      success: function(res){
        console.log('Succesfully added photo', res.photoId, 'to', res.user.id);
        loadNewPhoto();
      }, err: loadNewPhoto
    });
  });

  $('#trash-photo').click(function(){
    var queueId = $('#photo').data('queue-id');

    $.ajax({
      url: '/delete-queue-item/' + queueId,
      success: function(id){
        console.log('Successfully deleted photo', id);
        loadNewPhoto();
      }, error: loadNewPhoto
    });
  });

  $('#skip').click(loadNewPhoto);

});
