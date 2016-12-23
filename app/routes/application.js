import Ember from 'ember';
import RouteWithSearch from '../mixins/route-with-search';

export default Ember.Route.extend(RouteWithSearch, {
  beforeModel: function() {
    this.get('session').fetch();
  },
  actions: {
    login: function(email, password) {
      var route = this;
      this.get('session').open(email, password).then(function() {
        route.transitionTo('admin.index');
      });
    }
  },

  model: function() {
    return Ember.RSVP.hash({
      categories: this.get('store').findAll('category', { include: 'subcategories'} )
    });
  },

  title: function(tokens) {
    var tokenStr = tokens.join('');
    if (tokenStr) {
      return tokenStr + ' - Ember Observer';
    } else {
      return 'Ember Observer';
    }
  }
});
