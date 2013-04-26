(function(Spine, $, exports){
  var alert_error = Handlebars.compile($('#alert-error-tpl').html());

  var entries = new Entries();
  var entry_detail = new EntryDetail();
  var credit_form = new CreditForm();
  var debit_form= new DebitForm();
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
          if(params.type === 'credit'){
            obj = Credit.find(params.id);
          } else {
            obj = Debit.find(params.id);
          }

          edit_modal.form(obj, params.type);
        },
        "/delete/:id": function(params){
          Entry.destroy(params.id);
          Debit.select(function(debit){
            if(debit.entryid === params.id){
              debit.destroy();
            }
          });
          Credit.select(function(credit){
            if(credit.entryid === params.id){
              credit.destroy();
            }
          });
          entry_detail.init();
        },
        "/delete/credit/:id": function(params){
          Credit.destroy(params.id);
        },
        "/delete/debit/:id": function(params){
          Debit.destroy(params.id);
        }
      });

      Entry.fetch();
      Credit.fetch();
      Debit.fetch();
    }
  });

  new App();

  Spine.Route.setup();
})(Spine, Spine.$, window);
