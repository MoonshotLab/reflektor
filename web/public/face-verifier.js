Mousetrap.bind('command+j', function(e){
  e.preventDefault();
  confirmUser();
});

Mousetrap.bind('command+d', function(e){
  e.preventDefault();
  deleteQueueItem();
});

Mousetrap.bind('command+k', function(e){
  e.preventDefault();
  loadNewPhoto();
});


var loadNewPhoto = function(){
  $.ajax({
    url: '/get-random-photo-in-queue',
    success: function(data){
      var photoPath = data.path.replace('photo-queue', '');
      $('#photo').data('queue-id', data._id);
      $('#photo').attr('src', photoPath);
    }
  });
};


var confirmUser = function(){
  var queueId = $('#photo').data('queue-id');
  var userId = $('#user-selector').val();
  $.ajax({
    url: '/assign-queue-item/' + queueId + '?userId=' + userId,
    success: function(res){
      console.log('Succesfully added photo', res.faceFile, 'to', res.user.firstName, res.user.lastName);
      loadNewPhoto();
    }, err: loadNewPhoto
  });
};


var deleteQueueItem = function(){
  var queueId = $('#photo').data('queue-id');

  $.ajax({
    url: '/delete-queue-item/' + queueId,
    success: function(id){
      console.log('Successfully deleted photo', id);
      loadNewPhoto();
    }, error: loadNewPhoto
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

  $('#confirm-user').click(confirmUser);
  $('#trash-photo').click(deleteQueueItem);
  $('#skip').click(loadNewPhoto);

});
