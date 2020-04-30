import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { People } from '../../collections/people';

const groupByCompany = members => {
  const result = members
    .filter(member => !!member.companyName)
    .reduce(
      (acc, value) => ({
        ...acc,
        [value.companyName]: (acc[value.companyName] || 0) + 1,
      }),
      {}
    );
  return Object.entries(result)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (a.count > b.count) return -1;
      if (b.count > a.count) return 1;
      return 0;
    });
};

export const Statistics = ({
  communityId,
  membersCount,
  membersGroupedByCompany,
  membersNotCheckedIn,
}) => {
  if (communityId === 'default') {
    return null;
  }
  return (
    <div>
      <div>{`People in the event right now: ${membersCount}`}</div>
      <div>{`People by company in the event right now: ${membersGroupedByCompany
        .map(({ name, count }) => `${name} (${count})`)
        .join(', ')}`}</div>
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
    membersCount: People.find({ communityId }).count(),
    membersGroupedByCompany: groupByCompany(
      People.find({ communityId }).fetch()
    ),
    membersNotCheckedIn: People.find({
      communityId,
      checkedInAt: { $exists: false },
    }).count(),
  };
})(Statistics);
