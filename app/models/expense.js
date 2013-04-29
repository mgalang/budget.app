var Expense = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    entryid: {type: 'string'},
    value: {type: 'number'}
  });

};

Expense = geddy.model.register('Expense', Expense);

