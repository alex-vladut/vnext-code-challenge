import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { People } from '../../collections/people';

import { Member } from '../components/Member';

const Members = ({ communityId, members }) => {
  const handleCheckIn = member => {
    Meteor.call('people.checkIn', member._id);
  };

  const handleCheckOut = member => {
    Meteor.call('people.checkOut', member._id);
  };

  if (communityId === 'default') {
    return <p>Please select a community first</p>;
  } else if (!members.length) {
    return <p>There is no member in the community selected</p>;
  } else {
    return (
      <ul>
        {members.map(member => (
          <Member
            member={member}
            key={member._id}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        ))}
      </ul>
    );
  }
};

export default withTracker(({ communityId }) => {
  if (communityId === 'default') {
    return { communityId };
  }
  Meteor.subscribe('people.byCommunityId', communityId);

  return {
    communityId,
    members: People.find({ communityId }).fetch(),
  };
})(Members);
