var Debits = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.all(function(err, debits){
      self.respond(debits);
    });
  };

  this.create = function (req, resp, params) {
    var self = this
    , debit= geddy.model.Debit.create(params);

    if(!debit.isValid()){
      self.respond({ status: 0, error: debit.errors });
    }

    debit.save(function(err, data){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond(debit);
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.first(params.id, function(err, debit){
      if(!debit) {
        var err = new Error();
        err.statusCode = 404;
        self.respond({ status: 0, error: err });
      } else {
        self.respond(debit);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.first(params.id, function(err, debit){
      debit.updateProperties(params);

      if(!debit.isValid()){
        self.respond({ status: 0, error: debit.errors });
      }

      debit.save(function(err, data){
        if (err) {
          self.respond({ status: 0, error: err });
        } else {
          self.respond(debit);
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.remove(params.id, function(err){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond({ status: 1 });
      }
    });
  };

};

exports.Debits = Debits;


