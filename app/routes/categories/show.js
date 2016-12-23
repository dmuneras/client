import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params) {
    let categoryId = this.get('store').peekAll('category').findBy('slug', params.slug).get('id');
    return this.get('store').findRecord('category', categoryId, { include: 'addons,addons.categories' });
  },

  titleToken: function(model) {
    return model.get('name');
  },

  actions: {
    error: function() {
      this.replaceWith('model-not-found');
    }
  }
});
