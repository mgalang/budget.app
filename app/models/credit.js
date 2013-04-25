var Credit = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    entryid: {type: 'string'},
    value: {type: 'number'}
  });

};

Credit = geddy.model.register('Credit', Credit);

