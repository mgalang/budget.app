var Entry = function () {

  this.defineProperties({
    title: {type: 'string', required: true}
  });

  this.property('title', 'string', { required: true });
};

Entry = geddy.model.register('Entry', Entry);

