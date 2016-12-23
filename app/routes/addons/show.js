import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params) {
    let addon = this.get('store').query('addon', { filter: { name: params.name }, include: 'versions,maintainers,keywords,reviews,reviews.version,categories', page: { limit: 1 }}, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });

    let latestTestResult = this.get('store').query('test-result', { filter: { canary: false, addonName: params.name }, sort: '-createdAt', page: { limit: 1 }, include: 'ember-version-compatibilities'}).then((results) => {
      return results.get('firstObject');
    });

    return Ember.RSVP.hash({
      addon,
      latestTestResult
    });
  },

  titleToken: function(model) {
    if (model && model.addon) {
      return model.addon.get('name');
    }
  },

  afterModel: function() {
    this.get('emberVersions').fetch();
  },
  emberVersions: Ember.inject.service(),
  actions: {
    error: function() {
      this.replaceWith('model-not-found');
    }
  }
});
