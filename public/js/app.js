(function(Spine, $, exports){
  var Entry = Spine.Model.sub();
  Entry.configure("Entry", "title");
  Entry.extend(Spine.Model.Ajax);

  Entry.extend({
    url: "/entries"
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
      Entry.fetch();
    },
    add: function(item){
      var entry = new EntryItem({ entry: item });
      this.items.append(entry.render().el);
    },
    refresh: function(){
      Entry.each(this.proxy(this.add));
    },
    delete: function(e){
      e.preventDefault();

      var id = $(e.currentTarget).data('id');
      Entry.destroy(id);
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
    init: function(){
      this.el.html('No budget selected');
    },
    show: function(id){
      if(Entry.exists(id)){
        var entry = Entry.find(id);
        this.render(entry);
      } else {
        this.el.html('Budget not found');
      }
    },
    render: function(view){
      var template = this.template();
      this.el.html(template(view));
    },
    template: function(){
      return Handlebars.compile($('#entry-detail-tpl').html());
    }
  });

  var entries = new Entries();
  var entry_detail = new EntryDetail();

  var App = Spine.Controller.sub({
    el: $('#app'),
    init: function(){
      this.routes({
        "/entry/:id": function(params){
          entry_detail.show(params.id);
        }
      });
    }
  });

  new App();

  Spine.Route.setup();

  exports.Entry = Entry;
})(Spine, Spine.$, window);
