import React from 'react';
import Panel from '@/components/atoms/Panel';

const ReportTable = ({ title, data, columns, className = '' }) => (
  <Panel className={`p-0 ${className}`}>
    <div className="p-6 border-b border-surface-200">
      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-surface-500">No data available</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-surface-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-surface-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </Panel>
);

export default ReportTable;