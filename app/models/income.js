var Income = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    entryid: {type: 'string'},
    value: {type: 'number'}
  });

};

Income = geddy.model.register('Income', Income);

