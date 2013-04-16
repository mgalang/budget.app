var Entries = function () {
  this.respondsWith = ['json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.all(function(err, entries) {
      self.respond(entries);
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , entry = geddy.model.Entry.create(params);

    if (!entry.isValid()) {
      self.respond({ status: 0, error: entry.errors });
    }

    entry.save(function(err, data) {
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond(entry);
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.first(params.id, function(err, entry) {
      if (!entry) {
        var err = new Error();
        err.statusCode = 404;
        self.respond({ status: 0, error: err });
      } else {
        self.respond(entry);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.first(params.id, function(err, entry) {
      entry.updateProperties(params);
      if (!entry.isValid()) {
        self.respond({ status: 0, error: entry.errors });
      }

      entry.save(function(err, data) {
        if (err) {
          self.respond({ status: 0, error: err });
        } else {
          self.respond(entry);
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Entry.remove(params.id, function(err) {
      if (err) {
        self.respond({ status: 0, error: err });
      } else {
        self.respond({ status: 1 });
      }
    });
  };

};

exports.Entries = Entries;
