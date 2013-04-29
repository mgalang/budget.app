(function(Spine, $, exports){
  var IncomeItem = Spine.Controller.sub({
    init: function(){
      this.income.bind('update', this.proxy(this.render));
      this.income.bind('destroy', this.proxy(this.remove));
      this.template = Handlebars.compile($('#income-list-tpl').html());
    },
    render: function(){
      this.replace(this.template(this.income));
      return this;
    },
    remove: function(){
      this.el.remove();
      this.release();
    }
  });
 
  var Incomes = Spine.Controller.sub({
    el: $('#incomes-list'),
    init: function(){
      this.total = 0;
      Income.bind('create', this.proxy(this.get));
      Income.bind('destroy', this.proxy(this.update_total));
      Income.bind('update', this.proxy(this.update_total));
    },
    get: function(){
      this.$('tbody').empty();

      this.entry.incomes().select(this.proxy(function(income){
        this.add(income);
      }));

      this.update_total();
    },
    add: function(income){
      var item = new IncomeItem({ income: income });
      this.$('tbody').append(item.render().el);
    },
    update_total: function(){
      this.total = 0;
      this.entry.incomes().select(this.proxy(function(income){
          this.total+= parseFloat(income.value);
      }));

      this.$('.total').html(this.total.toFixed(2));
      this.trigger('updatetotal');
    }
  });

  var IncomeForm = Spine.Controller.sub({
    el: $('#income-form'),
    init: function(){
      this.el.bind('submit', this.proxy(this.submit));
    },
    submit: function(e){
      e.preventDefault();
      var income = new Income({
        title: this.$('input[name=title]').val(),
        value: this.$('input[name=value]').val(),
        entry: Entry.find(this.$('.entryid').val())
      });
      
      if(!income.save()){
        var msg = income.validate();
        alert(msg);
      } else {
        this.$('input[type=text]').val('');
      }
    }
  });

  var ExpenseItem = Spine.Controller.sub({
    init: function(){
      this.expense.bind('update', this.proxy(this.render));
      this.expense.bind('destroy', this.proxy(this.remove));
      this.template = Handlebars.compile($('#expense-list-tpl').html());
    },
    render: function(){
      this.replace(this.template(this.expense));
      return this;
    },
    remove: function(){
      this.el.remove();
      this.release();
    }
  });
 
  var Expenses = Spine.Controller.sub({
    el: $('#expenses-list'),
    init: function(){
      this.total = 0;
      Expense.bind('create', this.proxy(this.get));
      Expense.bind('destroy update', this.proxy(this.update_total));
    },
    get: function(){
      this.$('tbody').empty();
      this.entry.expenses().select(this.proxy(function(expense){
          this.add(expense);
      }));

      this.update_total();
    },
    add: function(expense){
      var item = new ExpenseItem({ expense: expense });
      this.$('tbody').append(item.render().el);
    },
    update_total: function(){
      this.total = 0;
      this.entry.expenses().select(this.proxy(function(expense){
          this.total+= parseFloat(expense.value);
      }));

      this.$('.total').html(this.total.toFixed(2));
      this.trigger('updatetotal');
    }
  });

  var ExpenseForm = Spine.Controller.sub({
    el: $('#expense-form'),
    init: function(){
      this.el.bind('submit', this.proxy(this.submit));
    },
    submit: function(e){
      e.preventDefault();
      
      var expense = new Expense({
        title: this.$('input[name=title]').val(),
        value: this.$('input[name=value]').val(),
        entry: Entry.find(this.$('.entryid').val())
      });

      if(!expense.save()){
        var msg = expense.validate();
        
        alert(msg);
      } else {
        this.$('input[type=text]').val('');
      }
    }
  });

  var EntryItem = Spine.Controller.sub({
    init: function(){
      this.entry.bind('update', this.proxy(this.render));
      this.entry.bind('destroy', this.proxy(this.remove));

      this.template = Handlebars.compile($('#entry-tpl').html());
    },
    render: function(){
      this.replace(this.template(this.entry));
      return this;
    },
    remove: function(){
      this.el.remove();
      this.release();
    }
  });

  var Entries = Spine.Controller.sub({
    el: $('#entries'),
    elements: {
      '.items': 'items'
    },
    events: {
      'submit #entry-form': 'submit'
    },
    init: function(){
      Entry.bind('create', this.proxy(this.add));
      Entry.bind('refresh', this.proxy(this.refresh));
    },
    add: function(item){
      var entry = new EntryItem({ entry: item });
      this.items.append(entry.render().el);
    },
    refresh: function(){
      Entry.each(this.proxy(this.add));
    },
    submit: function(e){
      e.preventDefault();

      var title = $('.title', e.target).val();
      $('.title', e.target).val('');
      var entry = Entry.create({ title: title });
      Spine.Route.navigate('/entry/'+entry.id);
    }
  });

  var EntryDetail = Spine.Controller.sub({
    el: $('#entry-detail'),
    elements: {
      '.title': 'title',
      '.delete': 'delete_button',
      '.entryid': 'entryid'
    },
    init: function(){
      this.el.addClass('is-empty');
      incomes.bind('updatetotal', this.proxy(this.update_balance));
      expenses.bind('updatetotal', this.proxy(this.update_balance));

      // update title after editing
      this.$('.title').blur(this.proxy(this.change_title));
      this.$('.title').keydown(function(e){
        // prevent newline
        if(e.keyCode == 13) {
          $(this).blur();
        }
      });
    },
    change_title: function(e){
      this.entry.title = $(e.target).html();
      this.entry.save();
    },
    show: function(id){
      this.el.removeClass('is-empty');
      if(Entry.exists(id)){
        this.entry = Entry.find(id);

        this.entryid.val(id);
        this.title.html(this.entry.title);
        this.delete_button.attr('href', '#/delete/'+this.entry.id);
       
        incomes.entry = this.entry;
        expenses.entry = this.entry;

        incomes.get();
        expenses.get();  
      } else {
        this.init();
      }
    },
    update_balance: function(e){
      this.$('.balance-value').html(incomes.total - expenses.total);
    }
  });

  var EditModal = Spine.Controller.sub({
    el: $('#edit-modal'),
    events: {
      'submit #editForm': 'submit'
    },
    form: function(obj, type){
      this.$('input[name=title]').val(obj.title);
      this.$('input[name=value]').val(obj.value);
      this.$('#id').val(obj.id);
      this.$('#type').val(type);
      $(this.el).modal('show');
    },
    submit: function(e){
      e.preventDefault();
      var model = {};

      if($('#type', e.target).val() === 'income'){
        model = Income;
      } else {
        model = Expense;
      }

      var _item = model.find($('#id', e.target).val());
      _item.title = $('input[name=title]', e.target).val();
      _item.value= $('input[name=value]', e.target).val();
      _item.save();

      $(this.el).modal('hide');
    }
  });

  var incomes = new Incomes();
  var expenses = new Expenses();

  exports.Entries = Entries;
  exports.EntryDetail = EntryDetail;
  exports.IncomeForm = IncomeForm;
  exports.ExpenseForm= ExpenseForm;
  exports.EditModal = EditModal;
})(Spine, Spine.$, window);
