var Debits = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.all(function(err, debits) {
      self.respond({params: params, debits: debits});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , debit = geddy.model.Debit.create(params);

    if (!debit.isValid()) {
      params.errors = debit.errors;
      self.transfer('add');
    }

    debit.save(function(err, data) {
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

    geddy.model.Debit.first(params.id, function(err, debit) {
      if (!debit) {
        var err = new Error();
        err.statusCode = 404;
        self.error(err);
      } else {
        self.respond({params: params, debit: debit.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.first(params.id, function(err, debit) {
      if (!debit) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, debit: debit});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Debit.first(params.id, function(err, debit) {
      debit.updateProperties(params);
      if (!debit.isValid()) {
        params.errors = debit.errors;
        self.transfer('edit');
      }

      debit.save(function(err, data) {
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

    geddy.model.Debit.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Debits = Debits;
