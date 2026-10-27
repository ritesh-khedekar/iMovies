import React from 'react';

const Badge = ({
  children,
  variant = 'neutral',
  icon = null,
  className = '',
  style = {},
  ...props
}) => {
  const variantClass = `ui-badge-${variant}`;

  return (
    <span
      className={`ui-badge ${variantClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {icon && <span className="d-inline-flex align-items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
