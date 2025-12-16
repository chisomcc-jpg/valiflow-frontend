import React from 'react';

const statusColors = {
  pending: 'bg-yellow-300 text-yellow-800',
  paid: 'bg-green-300 text-green-800',
  draft: 'bg-gray-300 text-gray-800',
};

export default function InvoiceStatus({ status }) {
  const classes = statusColors[status] || 'bg-gray-300 text-gray-800';

  return (
    <span className={`px-3 py-1 rounded-full font-semibold ${classes}`}>
      {status.toUpperCase()}
    </span>
  );
}
