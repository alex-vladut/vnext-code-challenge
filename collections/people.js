import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const People = new Mongo.Collection('people');

Meteor.methods({
  'people.checkIn'(memberId) {
    People.update(memberId, { $set: { checkedInAt: new Date() } });
  },
  'people.checkOut'(memberId) {
    People.update(memberId, { $set: { checkedOutAt: new Date() } });
  },
});
