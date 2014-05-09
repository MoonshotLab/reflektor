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
  if(!opts)
    return "<option selected='selected'></option>";
  else{
    return [
      "<option value='" + opts._id + "'>",
        opts.lastName + ', ' + opts.firstName,
      "</option>"
    ].join('');
  }
};
