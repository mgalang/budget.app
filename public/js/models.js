(function(Spine, $, exports){
  // Income Model
  var Income = Spine.Model.sub();
  Income.configure("Income", "title", "value");
  Income.extend(Spine.Model.Ajax);
  Income.belongsTo('entry', 'Entry', 'entryid');
  Income.extend({
    url: "/incomes"
  });

  Income.include({
    validate: function(){
      if( !this.title ){
        return "Income title/description is required";
      }
      if( !this.value || isNaN(this.value)){
        return "Invalid amount/value";
      }
    }
  });

  // Expense Model
  var Expense = Spine.Model.sub();
  Expense.configure("Expense", "title", "value");
  Expense.extend(Spine.Model.Ajax);
  Expense.belongsTo('entry', 'Entry', 'entryid');
  Expense.extend({
    url: "/expenses"
  });

  Expense.include({
    validate: function(){
      if( !this.title ){
        return "Expense title/description is required";
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
  Entry.hasMany('expenses', 'Expense', 'entryid');
  Entry.hasMany('incomes', 'Income', 'entryid');

  exports.Income = Income;
  exports.Expense = Expense;
  exports.Entry = Entry;
})(Spine, Spine.$, window);
