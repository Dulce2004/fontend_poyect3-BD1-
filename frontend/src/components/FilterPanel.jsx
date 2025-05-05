import React from 'react';
import './FilterPanel.css';

export default function FilterPanel({ filters, onFilterChange }) {
  return (
    <div className="filter-panel">
      <h3>Filtros de Búsqueda</h3>
      <div className="filter-grid">
        {filters.map(filter => (
          <div key={filter.name} className="filter-item">
            <label>{filter.label}</label>
            {filter.type === 'select' ? (
              <select name={filter.name} value={filter.value} onChange={onFilterChange}>
                <option value="">Todos</option>
                {filter.options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input type={filter.type} name={filter.name} value={filter.value} onChange={onFilterChange} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}