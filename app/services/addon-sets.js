import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  top: Ember.computed(function() {
    return this.get('store').query('addon', { page: { limit: 100 }, filter: { top: true }});
  }).volatile(),
  newest: Ember.computed(function() {
    return this.get('store').peekAll('addon').sortBy('publishedDate').reverse();
  }),
  recentlyReviewed: Ember.computed(function() {
    return this.get('store').peekAll('addon').sortBy('latestReviewedVersionDate').reverse();
  })
});
