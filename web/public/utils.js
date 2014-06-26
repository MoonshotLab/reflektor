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
