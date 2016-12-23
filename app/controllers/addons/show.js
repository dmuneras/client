import Ember from 'ember';
import sortBy from '../../utils/sort-by';
import moment from 'moment';

export default Ember.Controller.extend({
  addon: Ember.computed.alias('model.addon'),
  showExplanation: false,
  showBadgeText: false,
  categories: function() {
    return this.get('store').peekAll('category').sortBy('displayName');
  }.property(),
  licenseUrl: function() {
    return `https://spdx.org/licenses/${this.get('addon.license')}`;
  }.property('addon.license'),
  sortedReviews: sortBy('addon.reviews', 'versionReleased:desc'),
  latestReview: Ember.computed.alias('sortedReviews.firstObject'),
  isLatestReleaseInLast3Months: function() {
    if (!this.get('addon.latestVersion.released')) { return false; }
    var threeMonthsAgo = moment().subtract(3, 'months');
    return moment(this.get('addon.latestVersion.released')).isAfter(threeMonthsAgo);
  }.property('addon.latestVersion.released'),
  isLatestReviewForLatestVersion: function() {
    return this.get('latestReview') === this.get('addon.latestVersion.review');
  }.property('latestReview', 'addon.latestVersion.review'),
  badgeText: function() {
    return `[![Ember Observer Score](https://emberobserver.com/badges/${this.get('addon.name')}.svg)](https://emberobserver.com/addons/${this.get('addon.name')})`;
  }.property('addon.name'),
  installCommandText: function() {
    return `ember install ${this.get('addon.name')}`;
  }.property('addon.name'),
  badgeSrc: function() {
    return `https://emberobserver.com/badges/${this.get('addon.name')}.svg`;
  }.property('addon.name'),
  isTestResultForLatestVersion: Ember.computed('model.latestTestResult.version', 'addon.latestVersion', function() {
    return this.get('model.latestTestResult.version.version') === this.get('addon.latestVersion.version');
  }),

  actions: {
    save: function() {
      var controller = this;
      this.set('isSaving', true);
      this.get('addon').save().catch(function() {
        alert('Saving failed');
      }).finally(function() {
        controller.set('isSaving', false);
      });
    },
    review: function() {
      var newReview = this.get('store').createRecord('review');
      this.set('newReview', newReview);
      this.set('isReviewing', true);
    },
    renewLatestReview: function() {
      var newReview = this.get('store').createRecord('review');
      var latestReview = this.get('latestReview');

      latestReview.questions.forEach(function(question) {
        newReview.set(question.fieldName, latestReview.get(question.fieldName));
      });
      newReview.set('review', latestReview.get('review'));

      this.send('saveReview', newReview);
    },
    saveReview: function(newReview) {
      var controller = this;
      newReview.set('version', this.get('addon.latestVersion'));
      newReview.save().catch(function() {
        alert('Saving failed');
      }).finally(function() {
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    },
    toggleExplainScore: function() {
      this.toggleProperty('showExplanation');
    },
    toggleBadgeText: function() {
      this.toggleProperty('showBadgeText');
    }
  }

});
