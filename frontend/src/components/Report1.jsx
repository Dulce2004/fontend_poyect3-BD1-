import React, { useState } from 'react';
import FilterPanel from '../components/FilterPanel';
import { fetchReportData } from '../services/api';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import './Report1.css';


export default function Report1() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    shiftType: '',
    doctorName: '',
    area: '',
    status: '',
  });

  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const result = await fetchReportData('/report1', filters);
    setData(result);
  };

  const filterConfig = [
    { name: 'startDate', label: 'Fecha de inicio', type: 'date', value: filters.startDate },
    { name: 'endDate', label: 'Fecha de fin', type: 'date', value: filters.endDate },
    { name: 'shiftType', label: 'Tipo de turno', type: 'text', value: filters.shiftType },
    { name: 'doctorName', label: 'Nombre del médico', type: 'text', value: filters.doctorName },
    {
      name: 'area',
      label: 'Área',
      type: 'select',
      value: filters.area,
      options: [
        { value: 'emergencias', label: 'Emergencias' },
        { value: 'cirugía', label: 'Cirugía' },
        { value: 'consulta', label: 'Consulta externa' }
      ]
    },
    {
      name: 'status',
      label: 'Estado del turno',
      type: 'select',
      value: filters.status,
      options: [
        { value: 'activo', label: 'Activo' },
        { value: 'cancelado', label: 'Cancelado' },
        { value: 'finalizado', label: 'Finalizado' }
      ]
    },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Turnos por Médico", 14, 10);
  
    const tableColumn = ["Médico", "Fecha", "Turno", "Área", "Estado"];
    const tableRows = data.map(row => [
      row.doctor,
      row.date,
      row.shift,
      row.area,
      row.status,
    ]);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    doc.save('reporte_turnos.pdf');
  };
  const csvHeaders = [
    { label: "Médico", key: "doctor" },
    { label: "Fecha", key: "date" },
    { label: "Turno", key: "shift" },
    { label: "Área", key: "area" },
    { label: "Estado", key: "status" },
  ];
    

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Reporte de Turnos Médicos</h2>
          <div className="flex gap-3">
            <CSVLink
              data={data}
              headers={csvHeaders}
              filename="reporte_turnos.csv"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <span>Exportar Excel</span>
            </CSVLink>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Exportar PDF
            </button>
          </div>
        </div>

        <FilterPanel filters={filterConfig} onFilterChange={handleChange} />

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md"
        >
          Generar Reporte
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Médico", "Fecha", "Turno", "Área", "Estado"].map((header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.doctor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.shift}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {row.area}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === 'activo' ? 'bg-green-100 text-green-800' :
                          row.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p className="mt-4">No se encontraron resultados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}