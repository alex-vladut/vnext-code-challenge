import React, { useState, useEffect } from 'react';
import { format, differenceInSeconds } from 'date-fns';

const isCheckedIn = member => !!member.checkedInAt;
const isCheckedOut = member => !!member.checkedOutAt;

const shouldShowCheckOut = member => {
  return (
    isCheckedIn(member) &&
    !isCheckedOut(member) &&
    differenceInSeconds(new Date(), member.checkedInAt) > 5
  );
};

const formatDate = date => {
  if (!date) {
    return 'N/A';
  }
  return format(date, 'MM/dd/yyyy, HH:mm');
};

export const Member = ({ member, onCheckIn, onCheckOut }) => {
  const [checkedIn, setCheckedIn] = useState(isCheckedIn(member));
  const [showCheckOut, setShowCheckOut] = useState(shouldShowCheckOut(member));

  const handleCheckIn = () => {
    setCheckedIn(true);
    onCheckIn(member);
  };
  const handleCheckOut = () => {
    setShowCheckOut(false);
    onCheckOut(member);
  };
  useEffect(() => {
    if (checkedIn && !isCheckedOut(member)) {
      const difference = differenceInSeconds(new Date(), member.checkedInAt);
      if (difference < 5) {
        // If the member was just checked in to the event (i.e. less than 5 seconds ago)
        // then a timer will be set so that the checkout button will be displayed immediately when it is allowed to check out
        setTimeout(() => setShowCheckOut(true), (5 - difference) * 1000);
      }
    }
  }, [checkedIn, member, setShowCheckOut]);
  return (
    <li>
      <div>Name: {`${member.firstName} ${member.lastName}`}</div>
      <div>Company Name: {member.companyName || 'N/A'}</div>
      <div>Title: {member.title || 'N/A'}</div>
      <div>Check-in date: {formatDate(member.checkedInAt)}</div>
      <div>Check-out date: {formatDate(member.checkedOutAt)}</div>
      {!checkedIn ? (
        <button onClick={handleCheckIn}>
          Check-in {`${member.firstName} ${member.lastName}`}
        </button>
      ) : null}
      {showCheckOut ? (
        <button onClick={handleCheckOut}>
          Check-out {`${member.firstName} ${member.lastName}`}
        </button>
      ) : null}
    </li>
  );
};
