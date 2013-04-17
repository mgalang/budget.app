var Credits = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.all(function(err, credits){
      self.respond(credits);
    });
  };

  this.create = function (req, resp, params) {
    var self = this
    , credit= geddy.model.Credit.create(params);

    if(!credit.isValid()){
      self.respond({ status: 0, error: credit.errors });
    }

    credit.save(function(err, data){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond(credit);
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.first(params.id, function(err, credit){
      if(!credit) {
        var err = new Error();
        err.statusCode = 404;
        self.respond({ status: 0, error: err });
      } else {
        self.respond(credit);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.first(params.id, function(err, credit){
      credit.updateProperties(params);

      if(!credit.isValid()){
        self.respond({ status: 0, error: credit.errors });
      }

      credit.save(function(err, data){
        if (err) {
          self.respond({ status: 0, error: err });
        } else {
          self.respond(credit);
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.remove(params.id, function(err){
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond({ status: 1 });
      }
    });
  };

};

exports.Credits = Credits;

