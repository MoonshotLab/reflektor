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


var loadNewPhoto = function(){
  $.ajax({
    url: '/next-photo-in-queue',
    success: function(data){
      $('#photo').data('queue-id', data._id);
      $('#photo').css('background-image', data.imageSrc);
    }
  });
};


var createSelectTemplate = function(opts){
  return [
    "<option value='" + opts._id + "'>",
      opts.lastName + ', ' + opts.firstName,
    "</option>"
  ].join('');
};
