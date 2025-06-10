import React from 'react';
import Panel from '@/components/atoms/Panel';

const SettingSectionCard = ({ title, description, children }) => (
  <Panel>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
      <p className="text-surface-600 text-sm mt-1">{description}</p>
    </div>
    {children}
  </Panel>
);

export default SettingSectionCard;