import React from 'react';

export default function ExportButton({ endpoint, fileName }) {
  const handleExport = () => {
    fetch(`http://localhost:8000${endpoint}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
    >
      <span>Descargar {fileName}</span>
    </button>
  );
}