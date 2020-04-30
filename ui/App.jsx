import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { TEXTS } from '../shared/constants';

import { Communities } from '../collections/communities';

import { EventSelector } from './components/EventSelector';

import Statistics from './containers/Statistics';
import Members from './containers/Members';

const App = props => {
  const [event, setEvent] = useState('default');

  return (
    <div className="container">
      <h1>{TEXTS.HOME_TITLE}</h1>

      <EventSelector
        communities={props.communities}
        event={event}
        onChange={setEvent}
      />
      <Statistics communityId={event} />
      <Members communityId={event} />
    </div>
  );
};

export default withTracker(() => {
  Meteor.subscribe('communities');

  return {
    communities: Communities.find().fetch(),
  };
})(App);
