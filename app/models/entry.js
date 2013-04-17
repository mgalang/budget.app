var Entry = function () {

  this.defineProperties({
    title: {type: 'string', required: true}
  });

  this.hasMany('Credits');
  this.property('title', 'string', {required: true});
 
Entry = geddy.model.register('Entry', Entry);

