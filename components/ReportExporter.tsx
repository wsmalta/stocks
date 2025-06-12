
import React from 'react';

export const ReportExporter: React.FC = () => {
  const handleExport = () => {
    window.print();
  };

  return (
    <section className="mt-8 text-center no-print">
      <button
        onClick={handleExport}
        className="py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition duration-150 ease-in-out"
      >
        Exportar Relatório para PDF
      </button>
    </section>
  );
};