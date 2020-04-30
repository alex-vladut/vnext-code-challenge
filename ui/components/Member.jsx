import React from 'react';
import { format } from 'date-fns';

const isCheckedIn = member => !!member.checkedInAt;
const isCheckedOut = member => !!member.checkedOutAt;
const formatDate = date => {
  if (!date) {
    return 'N/A';
  }
  return format(date, 'MM/dd/yyyy, HH:mm')
};

export const Member = ({ member, onCheckIn, onCheckOut }) => {
  return (
    <div>
      <div>Name: {`${member.firstName} ${member.lastName}`}</div>
      <div>Company Name: {member.companyName || 'N/A'}</div>
      <div>Title: {member.title || 'N/A'}</div>
      <div>Check-in date: {formatDate(member.checkedInAt)}</div>
      <div>Check-out date: {formatDate(member.checkedOutAt)}</div>
      {!isCheckedIn(member) ? (
        <button onClick={onCheckIn}>
          Check-in {`${member.firstName} ${member.lastName}`}
        </button>
      ) : null}
      {isCheckedIn(member) && !isCheckedOut(member) ? (
        <button onClick={onCheckOut}>
          Check-out {`${member.firstName} ${member.lastName}`}
        </button>
      ) : null}
      <hr />
    </div>
  );
};
