(function(Spine, $, exports){
  var CreditItem = Spine.Controller.sub({
    init: function(){
      this.credit.bind('update', this.proxy(this.render));
      this.credit.bind('destroy', this.proxy(this.remove));
      this.template = Handlebars.compile($('#credit-list-tpl').html());
    },
    render: function(){
      this.replace(this.template(this.credit));
      return this;
    },
    remove: function(){
      this.el.remove();
      this.release();
    }
  });
 
  var Credits = Spine.Controller.sub({
    el: $('#credits-list'),
    init: function(){
      this.total = 0;
      Credit.bind('create', this.proxy(this.get));
      Credit.bind('destroy', this.proxy(this.update_total));
      Credit.bind('update', this.proxy(this.update_total));
    },
    get: function(){
      this.$('tbody').empty();

      this.entry.credits().select(this.proxy(function(credit){
        this.add(credit);
      }));

      this.update_total();
    },
    add: function(credit){
      var item = new CreditItem({ credit: credit });
      this.$('tbody').append(item.render().el);
    },
    update_total: function(){
      this.total = 0;
      this.entry.credits().select(this.proxy(function(credit){
          this.total+= parseFloat(credit.value);
      }));

      this.$('.total').html(this.total.toFixed(2));
      this.trigger('updatetotal');
    }
  });

  var CreditForm = Spine.Controller.sub({
    el: $('#credit-form'),
    init: function(){
      this.el.bind('submit', this.proxy(this.submit));
    },
    submit: function(e){
      e.preventDefault();
      var credit = new Credit({
        title: this.$('input[name=title]').val(),
        value: this.$('input[name=value]').val(),
        entry: Entry.find(this.$('.entryid').val())
      });
      
      if(!credit.save()){
        var msg = credit.validate();
        alert(msg);
      } else {
        this.$('input[type=text]').val('');
      }
    }
  });

  var DebitItem = Spine.Controller.sub({
    init: function(){
      this.debit.bind('update', this.proxy(this.render));
      this.debit.bind('destroy', this.proxy(this.remove));
      this.template = Handlebars.compile($('#debit-list-tpl').html());
    },
    render: function(){
      this.replace(this.template(this.debit));
      return this;
    },
    remove: function(){
      this.el.remove();
      this.release();
    }
  });
 
  var Debits = Spine.Controller.sub({
    el: $('#debits-list'),
    init: function(){
      this.total = 0;
      Debit.bind('create', this.proxy(this.get));
      Debit.bind('destroy update', this.proxy(this.update_total));
    },
    get: function(){
      this.$('tbody').empty();
      this.entry.debits().select(this.proxy(function(debit){
          this.add(debit);
      }));

      this.update_total();
    },
    add: function(debit){
      var item = new DebitItem({ debit: debit });
      this.$('tbody').append(item.render().el);
    },
    update_total: function(){
      this.total = 0;
      this.entry.debits().select(this.proxy(function(debit){
          this.total+= parseFloat(debit.value);
      }));

      this.$('.total').html(this.total.toFixed(2));
      this.trigger('updatetotal');
    }
  });

  var DebitForm = Spine.Controller.sub({
    el: $('#debit-form'),
    init: function(){
      this.el.bind('submit', this.proxy(this.submit));
    },
    submit: function(e){
      e.preventDefault();
      
      var debit = new Debit({
        title: this.$('input[name=title]').val(),
        value: this.$('input[name=value]').val(),
        entry: Entry.find(this.$('.entryid').val())
      });

      if(!debit.save()){
        var msg = debit.validate();
        
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
    current_id: 0,
    elements: {
      '.title': 'title',
      '.delete': 'delete_button',
      '.entryid': 'entryid'
    },
    init: function(){
      this.el.addClass('is-empty');
      credits.bind('updatetotal', this.proxy(this.update_balance));
      debits.bind('updatetotal', this.proxy(this.update_balance));
    },
    show: function(id){
      this.el.removeClass('is-empty');
      if(Entry.exists(id)){
        this.current_id = id;
        var entry = Entry.find(id);

        this.entryid.val(id);
        this.title.html(entry.title);
        this.delete_button.attr('href', '#/delete/'+entry.id);
       
        credits.entry = entry;
        debits.entry = entry;

        credits.get();
        debits.get();  
      } else {
        this.init();
      }
    },
    update_balance: function(e){
      this.$('.balance-value').html(credits.total - debits.total);
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

      if($('#type', e.target).val() === 'credit'){
        var model = Credit;
      } else {
        var model = Debit;
      }

      var _item = model.find($('#id', e.target).val());
      _item.title = $('input[name=title]', e.target).val();
      _item.value= $('input[name=value]', e.target).val();
      _item.save();

      $(this.el).modal('hide');
    }
  });

  var credits = new Credits();
  var debits = new Debits();

  exports.Entries = Entries;
  exports.EntryDetail = EntryDetail;
  exports.CreditForm = CreditForm;
  exports.DebitForm= DebitForm;
  exports.EditModal = EditModal;
})(Spine, Spine.$, window);
