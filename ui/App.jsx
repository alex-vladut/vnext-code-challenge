import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { TEXTS } from '../shared/constants';

import { Communities } from '../collections/communities';
import { People } from '../collections/people';

import { EventSelector } from './components/EventSelector';
import { Member } from './components/Member';

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
    })
    .slice(0, 10);
};

const App = props => {
  const [event, setEvent] = useState('default');
  const [members, setMembers] = useState([]);
  const [eventMembersCount, setEventMembersCount] = useState(0);
  const [
    eventMembersGroupedByCompany,
    setEventMembersGroupedByCompany,
  ] = useState([]);
  const [eventMembersNotCheckedIn, setEventMembersNotCheckedIn] = useState(0);

  useEffect(() => {
    if (event === 'default') {
      setMembers([]);
    } else {
      const members = People.find({ communityId: event }).fetch();
      setMembers(members);
      setEventMembersCount(People.find({ communityId: event }).count());
      setEventMembersGroupedByCompany(groupByCompany(members));
      setEventMembersNotCheckedIn(
        People.find({
          communityId: event,
          checkedInAt: { $exists: false },
        }).count()
      );
    }
  }, [event, setMembers]);

  const handleCheckIn = member => {
    Meteor.call('people.checkIn', member._id);
  };

  const handleCheckOut = member => {
    Meteor.call('people.checkOut', member._id);
  };

  const renderStats = () => {
    if (event === 'default') {
      return null;
    }
    return (
      <div>
        <div>{`People in the event right now: ${eventMembersCount}`}</div>
        <div>{`People by company in the event right now: ${eventMembersGroupedByCompany
          .map(({ name, count }) => `${name} (${count})`)
          .join(', ')}`}</div>
        <div>{`People not checked-in: ${eventMembersNotCheckedIn}`}</div>
      </div>
    );
  };

  const renderMembers = () => {
    if (event === 'default') {
      return <p>Please select a community first</p>;
    } else if (!members.length) {
      return <p>There is no member in the community selected</p>;
    } else {
      return members.map(member => (
        <Member
          member={member}
          key={member._id}
          onCheckIn={() => handleCheckIn(member)}
          onCheckOut={() => handleCheckOut(member)}
        />
      ));
    }
  };

  return (
    <div>
      <h1>{TEXTS.HOME_TITLE}</h1>

      <EventSelector
        communities={props.communities}
        event={event}
        onChange={setEvent}
      />
      {renderStats()}
      {renderMembers()}
    </div>
  );
};

export default withTracker(() => {
  return {
    communities: Communities.find({}).fetch(),
  };
})(App);
