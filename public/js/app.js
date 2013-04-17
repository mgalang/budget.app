(function(Spine, $, exports){
  var alert_error = Handlebars.compile($('#alert-error-tpl').html());

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

  var Entry = Spine.Model.sub();
  Entry.configure("Entry", "title")
    .extend(Spine.Model.Ajax)
    .extend({
      url: "/entries"
    });


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
      Credit.bind('update', this.proxy(this.get));
      this.get();
    },
    get: function(){
      this.$('tbody').empty();
      var _credits = Credit.select(this.proxy(function(credit){
        return credit.entryid === this.id;
      }));

      for(var i in _credits){
        this.add(_credits[i]);
      }
    },
    add: function(credit){
      var item = new CreditItem({ credit: credit });
      this.$('tbody').append(item.render().el);
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
    elements: {
      '.title': 'title',
      '.delete': 'delete_button',
      '#entryid': 'entryid'
    },
    init: function(){
      this.el.addClass('is-empty');
    },
    show: function(id){
      this.el.removeClass('is-empty');
      if(Entry.exists(id)){
        var entry = Entry.find(id);

        this.entryid.val(id);
        this.title.html(entry.title);
        this.delete_button.attr('href', '#/delete/'+entry.id);

        new Credits({ id: entry.id });
      } else {
        this.init();
      }
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
        
        entry_detail.el.prepend(alert_error({ message: msg }));
      } else {
        this.$('input[type=text]').val('');
      }
    }
  });

  var entries = new Entries();
  var entry_detail = new EntryDetail();
  var credit_form = new CreditForm();

  var App = Spine.Controller.sub({
    el: $('#app'),
    init: function(){
      this.routes({
        "/entry/:id": function(params){
          entry_detail.show(params.id);
        },
        "/delete/:id": function(params){
          Entry.destroy(params.id);
          entry_detail.init();
        },
        "/delete/credit/:id": function(params){
          Credit.destroy(params.id);
        }
      });

      Entry.fetch();
      Credit.fetch();
    }
  });

  new App();

  Spine.Route.setup();

  exports.Entry = Entry;
  exports.Credit= Credit;
})(Spine, Spine.$, window);
