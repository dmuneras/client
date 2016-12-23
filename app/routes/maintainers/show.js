import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').query('maintainer', { filter: { name: params.name } }).then((maintainers) => {
      return maintainers.get('firstObject');
    });
  },

  titleToken: function(model) {
    if (model) {
      return model.get('name');
    }
  },

  actions: {
    error: function() {
      this.replaceWith('model-not-found');
    }
  }
});
