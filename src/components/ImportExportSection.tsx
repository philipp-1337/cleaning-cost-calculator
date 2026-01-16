import type { RefObject } from 'react';
import { Upload, Download, FileText } from 'lucide-react';

type ImportExportSectionProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  dragActive: boolean;
  onImport: (file: File) => void;
  onExport: () => void;
  onHumanExport: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
};

export default function ImportExportSection({
  fileInputRef,
  dragActive,
  onImport,
  onExport,
  onHumanExport,
  onDragOver,
  onDragLeave,
  onDrop,
  children
}: ImportExportSectionProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 mb-6 transition border-2 ${
        dragActive ? 'border-blue-400' : 'border-transparent'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
            aria-label="Importieren"
          >
            <span className="sm:hidden">
              <Upload className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">Importieren</span>
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                onImport(e.target.files[0]);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
            aria-label="Exportieren"
          >
            <span className="sm:hidden">
              <Download className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">Exportieren</span>
          </button>
          <button
            onClick={onHumanExport}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
            aria-label="Human Export"
          >
            <span className="sm:hidden">
              <FileText className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">Human Export</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {dragActive 
            ? 'Datei hier ablegen zum Importieren...' 
            : 'JSON-Datei per Drag & Drop oder Import-Button hochladen.'
          }
        </div>
      </div>
      
      {children}
    </div>
  );
}