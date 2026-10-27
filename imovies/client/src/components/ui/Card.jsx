import React from 'react';

const Card = ({
  children,
  hover = false,
  padding = '24px',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`ui-card ${hover ? 'ui-card-hover' : ''} ${className}`.trim()}
      style={{
        padding: padding,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
