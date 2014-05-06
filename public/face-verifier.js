$(function(){

  var $userSelector = $('#user-selector');

  $.ajax({
    url: '/all-users',
    success: function(users){
      users.forEach(function(user){
        var selectItem = createSelectTemplate(user);
        $userSelector.append(selectItem);
      });
    }
  });

});


var createSelectTemplate = function(opts){
  return [
    "<option value='" + opts._id + "'>",
      opts.lastName + ', ' + opts.firstName,
    "</option>"
  ].join('');
}
