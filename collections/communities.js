import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Communities = new Mongo.Collection('communities');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('communities', function tasksPublication() {
    return Communities.find();
  });
}
