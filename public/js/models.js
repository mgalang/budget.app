(function(Spine, $, exports){
  // Credit Model
  var Credit = Spine.Model.sub();
  Credit.configure("Credit", "title", "entryid", "value")
  Credit.extend(Spine.Model.Ajax)
  Credit.extend({
    url: "/credits",
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
  Debit.configure("Debit", "title", "entryid", "value")
  Debit.extend(Spine.Model.Ajax)
  Debit.extend({
    url: "/debits",
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

  exports.Credit = Credit;
  exports.Debit = Debit;
  exports.Entry = Entry;
})(Spine, Spine.$, window);
