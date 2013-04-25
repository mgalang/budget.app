var Debit = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    entryid: {type: 'string'},
    value: {type: 'number'}
  });

};

Debit = geddy.model.register('Debit', Debit);

