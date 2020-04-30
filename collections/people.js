import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const People = new Mongo.Collection('people');

if (Meteor.isServer) {
  Meteor.publish('people.byCommunityId', function(communityId) {
    return People.find({ communityId });
  });
}

Meteor.methods({
  'people.checkIn': function(memberId) {
    People.update(memberId, { $set: { checkedInAt: new Date() } });
  },
  'people.checkOut': function(memberId) {
    People.update(memberId, { $set: { checkedOutAt: new Date() } });
  },
});
