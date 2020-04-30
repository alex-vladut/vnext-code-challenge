import React from 'react';

export const EventSelector = props => {
  const handleChange = e => {
    props.onChange(e.target.value);
  };

  return (
    <select value={props.event} onChange={handleChange} className="select-css">
      <option value="default">Select an event</option>
      {props.communities.map(e => (
        <option value={e._id} key={e._id}>
          {e.name}
        </option>
      ))}
    </select>
  );
};
