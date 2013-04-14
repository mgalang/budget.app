var Credits = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.all(function(err, credits) {
      self.respond({params: params, credits: credits});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , credit = geddy.model.Credit.create(params);

    if (!credit.isValid()) {
      params.errors = credit.errors;
      self.transfer('add');
    }

    credit.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.first(params.id, function(err, credit) {
      if (!credit) {
        var err = new Error();
        err.statusCode = 404;
        self.error(err);
      } else {
        self.respond({params: params, credit: credit.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.first(params.id, function(err, credit) {
      if (!credit) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, credit: credit});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.first(params.id, function(err, credit) {
      credit.updateProperties(params);
      if (!credit.isValid()) {
        params.errors = credit.errors;
        self.transfer('edit');
      }

      credit.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Credit.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Credits = Credits;
