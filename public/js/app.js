(function(Spine, $, exports){
  var alert_error = Handlebars.compile($('#alert-error-tpl').html());

  var entries = new Entries();
  var entry_detail = new EntryDetail();
  var income_form = new IncomeForm();
  var expense_form= new ExpenseForm();
  var edit_modal = new EditModal();

  var App = Spine.Controller.sub({
    el: $('#app'),
    init: function(){
      this.routes({
        "/entry/:id": function(params){
          entry_detail.show(params.id);
        },
        "/edit/:type/:id": function(params){
          var obj = {};
          if(params.type === 'income'){
            obj = Income.find(params.id);
          } else {
            obj = Expense.find(params.id);
          }

          edit_modal.form(obj, params.type);
        },
        "/delete/:id": function(params){
          Entry.destroy(params.id);
          Expense.select(function(expense){
            if(expense.entryid === params.id){
              expense.destroy();
            }
          });
          Income.select(function(income){
            if(income.entryid === params.id){
              income.destroy();
            }
          });
          entry_detail.init();
        },
        "/delete/income/:id": function(params){
          Income.destroy(params.id);
        },
        "/delete/expense/:id": function(params){
          Expense.destroy(params.id);
        }
      });

      Entry.fetch();
      Income.fetch();
      Expense.fetch();
    }
  });

  new App();

  Spine.Route.setup();
})(Spine, Spine.$, window);
