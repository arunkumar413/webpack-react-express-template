import React from 'react';

export function Lables({ allLabels, selectLabels }) {
  const labelElements = allLabels.map(function (label, index) {
    return <button onClick={selectLabels(label)}> {label.name} </button>;
  });

  return <div>{labelElements}</div>;
}
