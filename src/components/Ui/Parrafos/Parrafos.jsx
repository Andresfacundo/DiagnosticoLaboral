import React from 'react'
import  formatCurrency  from '../../../utils/formatUtils';


const Parrafos = ({ content, results, content1, content2, operador }) => {
  let value = 0;

  if (Array.isArray(results)) {
    value = results?.[results.length - 1]?.[content1]?.[content2] || 0;
  } else if (typeof results === 'string') {
    value = results;
  } else {
    value = results?.[content1]?.[content2] || 0;
  }

  return (
    <p>
      {content}
      <span>{typeof value === 'number' ? formatCurrency(value) : value}</span>
      {operador && <span className="operador">{operador}</span>}
    </p>
  );
};


export default Parrafos;