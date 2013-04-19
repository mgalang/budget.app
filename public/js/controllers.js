(function(Spine, $, exports){
  var CreditItem = Spine.Controller.sub({
    init: function(){
      this.credit.bind('update', this.proxy(this.render));
      this.credit.bind('destroy', this.proxy(this.remove));
    },
    render: function(){
      var template = this.template();
      this.replace(template(this.credit));
      return this;
    },
    template: function(){
      return Handlebars.compile($('#credit-list-tpl').html());
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
      Credit.bind('update', this.proxy(this.get));
      Credit.bind('destroy', this.proxy(this.update_total));
      this.get();
    },
    get: function(){
      this.$('tbody').empty();
      Credit.select(this.proxy(function(credit){
        if(credit.entryid === this.id){
          this.add(credit);
        }
      }));

      this.update_total();
    },
    add: function(credit){
      var item = new CreditItem({ credit: credit });
      this.$('tbody').append(item.render().el);
    },
    update_total: function(){
      this.total = 0;
      Credit.select(this.proxy(function(credit){
        if(credit.entryid === this.id){
          this.total+= parseFloat(credit.value);
        }
      }));

      this.$('.total').html(this.total.toFixed(2));
    }
  });

  var CreditForm = Spine.Controller.sub({
    el: $('#credit-form'),
    init: function(){
      this.el.bind('submit', this.proxy(this.submit));
    },
    submit: function(e){
      e.preventDefault();
      
      var credit = Credit.fromForm(e.target);
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
    },
    render: function(){
      var template = this.template();
      this.replace(template(this.debit));
      return this;
    },
    template: function(){
      return Handlebars.compile($('#debit-list-tpl').html());
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
      Debit.bind('update', this.proxy(this.get));
      Debit.bind('destroy', this.proxy(this.update_total));
      this.get();
    },
    get: function(){
      this.$('tbody').empty();
      Debit.select(this.proxy(function(debit){
        if(debit.entryid === this.id){
          this.add(debit);
        }
      }));

      this.update_total();
    },
    add: function(debit){
      var item = new DebitItem({ debit: debit });
      this.$('tbody').append(item.render().el);
    },
    update_total: function(){
      this.total = 0;
      Debit.select(this.proxy(function(debit){
        if(debit.entryid === this.id){
          this.total+= parseFloat(debit.value);
        }
      }));

      this.$('.total').html(this.total.toFixed(2));
    }
  });

  var DebitForm = Spine.Controller.sub({
    el: $('#debit-form'),
    init: function(){
      this.el.bind('submit', this.proxy(this.submit));
    },
    submit: function(e){
      e.preventDefault();
      
      var debit = Debit.fromForm(e.target);
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
    },
    render: function(){
      var _tpl = Handlebars.compile($('#entry-tpl').html());
      this.replace(_tpl(this.entry));
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
      Entry.create({ title: title });
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
      Credit.bind('create destroy', this.proxy(this.update_balance));
      Debit.bind('create destroy', this.proxy(this.update_balance));
    },
    show: function(id){
      this.el.removeClass('is-empty');
      if(Entry.exists(id)){
        this.current_id = id;
        var entry = Entry.find(id);

        this.entryid.val(id);
        this.title.html(entry.title);
        this.delete_button.attr('href', '#/delete/'+entry.id);

        new Credits({ id: entry.id });
        new Debits({ id: entry.id });
        this.update_balance();
      } else {
        this.init();
      }
    },
    update_balance: function(){
      var credits= 0;
      Credit.select(this.proxy(function(credit){
        if(credit.entryid === this.current_id){
          credits+= parseFloat(credit.value);
        }
      }));

      var debits= 0;
      Debit.select(this.proxy(function(debit){
        if(debit.entryid === this.current_id){
          debits+= parseFloat(debit.value);
        }
      }));

      this.$('.balance-value').html(credits - debits);
    }
  });

  
  exports.Entries = Entries;
  exports.EntryDetail = EntryDetail;
  exports.CreditForm = CreditForm;
  exports.DebitForm= DebitForm;;
})(Spine, Spine.$, window);
