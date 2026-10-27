import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PageHeader = ({
  title,
  subtitle,
  backTo = null,
  backLabel = 'Back',
  actions = null,
  className = '',
}) => {
  return (
    <div
      className={`page-header ${className}`.trim()}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div>
        {backTo && (
          <Link
            to={backTo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            <FiArrowLeft size={16} />
            <span>{backLabel}</span>
          </Link>
        )}
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{title}</h1>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{actions}</div>}
    </div>
  );
};

export default PageHeader;
