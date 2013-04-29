var Incomes = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Income.all(function(err, incomes){
      self.respond(incomes);
    });
  };

  this.create = function (req, resp, params) {
    var self = this,
    income= geddy.model.Income.create(params);

    if(!income.isValid()){
      self.respond({ status: 0, error: income.errors });
    }

    income.save(function(err, data){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond(income);
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Income.first(params.id, function(err, income){
      if(!income) {
        err = new Error();
        err.statusCode = 404;
        self.respond({ status: 0, error: err });
      } else {
        self.respond(income);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Income.first(params.id, function(err, income){
      income.updateProperties(params);

      if(!income.isValid()){
        self.respond({ status: 0, error: income.errors });
      }

      income.save(function(err, data){
        if (err) {
          self.respond({ status: 0, error: err });
        } else {
          self.respond(income);
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Income.remove(params.id, function(err){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond({ status: 1 });
      }
    });
  };

};

exports.Incomes = Incomes;

