import React from 'react';
import { FiFilm } from 'react-icons/fi';
import Button from './Button';

const EmptyState = ({
  icon = <FiFilm size={40} />,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionText = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div
      className={`ui-card text-center ${className}`.trim()}
      style={{
        padding: '56px 24px',
        maxWidth: '540px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-alt)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: 'var(--text-secondary)',
        }}
      >
        {icon}
      </div>

      <h3 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: actionText ? '24px' : '0', lineHeight: 1.6 }}>
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
