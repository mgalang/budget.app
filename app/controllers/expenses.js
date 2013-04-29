var Expenses = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Expense.all(function(err, expenses){
      self.respond(expenses);
    });
  };

  this.create = function (req, resp, params) {
    var self = this, 
        expense= geddy.model.Expense.create(params);

    if(!expense.isValid()){
      self.respond({ status: 0, error: expense.errors });
    }

    expense.save(function(err, data){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond(expense);
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Expense.first(params.id, function(err, expense){
      if(!expense) {
        err = new Error();
        err.statusCode = 404;
        self.respond({ status: 0, error: err });
      } else {
        self.respond(expense);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Expense.first(params.id, function(err, expense){
      expense.updateProperties(params);

      if(!expense.isValid()){
        self.respond({ status: 0, error: expense.errors });
      }

      expense.save(function(err, data){
        if (err) {
          self.respond({ status: 0, error: err });
        } else {
          self.respond(expense);
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Expense.remove(params.id, function(err){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond({ status: 1 });
      }
    });
  };

};

exports.Expenses = Expenses;


