import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { People } from '../../collections/people';

const groupByCompany = members => {
  const result = members
    // some of the members don't have company details, so will be filtered out
    .filter(member => !!member.companyName)
    .reduce(
      (acc, value) => ({
        ...acc,
        [value.companyName]: (acc[value.companyName] || 0) + 1,
      }),
      {}
    );
  return (
    Object.entries(result)
      .map(([name, count]) => ({ name, count }))
      // for convenience, the companies will be displayed in descending order based on the number of employees attending the event
      .sort((a, b) => {
        if (a.count > b.count) return -1;
        if (b.count > a.count) return 1;
        return 0;
      })
      .map(({ name, count }) => `${name} (${count})`)
      .join(', ')
  );
};

export const Statistics = ({
  communityId,
  membersInEvent,
  membersNotCheckedIn,
}) => {
  if (communityId === 'default') {
    return null;
  }
  return (
    <div className="statistics">
      <div>{`People in the event right now: ${membersInEvent.length}`}</div>
      <div>{`People by company in the event right now: ${groupByCompany(
        membersInEvent
      )}`}</div>
      <div>{`People not checked-in: ${membersNotCheckedIn}`}</div>
    </div>
  );
};

export default withTracker(({ communityId }) => {
  if (communityId === 'default') {
    return { communityId };
  }

  Meteor.subscribe('people.byCommunityId', communityId);
  return {
    communityId,
    // will find all the people who were checked in for the event (i.e. have "checkedInAt" field set)
    // and who are not yet checked out of the event (i.e. the field "checkedOutAt" is not set)
    membersInEvent: People.find({
      communityId,
      checkedInAt: { $exists: true },
      checkedOutAt: { $exists: false },
    }).fetch(),
    membersNotCheckedIn: People.find({
      communityId,
      checkedInAt: { $exists: false },
    }).count(),
  };
})(Statistics);
