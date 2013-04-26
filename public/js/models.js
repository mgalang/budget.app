(function(Spine, $, exports){
  // Credit Model
  var Credit = Spine.Model.sub();
  Credit.configure("Credit", "title", "value");
  Credit.extend(Spine.Model.Ajax);
  Credit.belongsTo('entry', 'Entry', 'entryid');
  Credit.extend({
    url: "/credits"
  });

  Credit.include({
    validate: function(){
      if( !this.title ){
        return "Credit title/description is required";
      }
      if( !this.value || isNaN(this.value)){
        return "Invalid amount/value";
      }
    }
  });

  // Debit Model
  var Debit = Spine.Model.sub();
  Debit.configure("Debit", "title", "value");
  Debit.extend(Spine.Model.Ajax);
  Debit.belongsTo('entry', 'Entry', 'entryid');
  Debit.extend({
    url: "/debits"
  });

  Debit.include({
    validate: function(){
      if( !this.title ){
        return "Debit title/description is required";
      }
      if( !this.value || isNaN(this.value)){
        return "Invalid amount/value";
      }
    }
  });

  // Budget Entry Model
  var Entry = Spine.Model.sub();
  Entry.configure("Entry", "title")
    .extend(Spine.Model.Ajax)
    .extend({
      url: "/entries"
    });
  Entry.hasMany('debits', 'Debit', 'entryid');
  Entry.hasMany('credits', 'Credit', 'entryid');

  exports.Credit = Credit;
  exports.Debit = Debit;
  exports.Entry = Entry;
})(Spine, Spine.$, window);
