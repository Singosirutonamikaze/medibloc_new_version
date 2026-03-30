import { type ReactNode, useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaBoxOpen, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import DataTableSkeleton from './DataTableSkeleton';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onView?: (item: T) => void;
  renderDetails?: (item: T) => ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  title?: string;
}

export function DataTable<T extends Record<string, any>>({
  data = [],
  columns,
  isLoading,
  selectable = true,
  onSelectionChange,
  onView,
  renderDetails,
  onEdit,
  onDelete,
  keyExtractor,
  emptyMessage = "Aucun élément trouvé.",
  title,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [internalViewItem, setInternalViewItem] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const safeData = Array.isArray(data) ? data : [];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = safeData.map(keyExtractor);
      const newSet = new Set(allIds);
      setSelectedIds(newSet);
      onSelectionChange?.(Array.from(newSet));
    } else {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
    onSelectionChange?.(Array.from(newSet));
  };

  const handleView = (item: T) => {
    if (onView) onView(item);
    else setInternalViewItem(item);
  };

  const confirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  if (isLoading) return <DataTableSkeleton columns={columns.length} />;

  const isEmpty = safeData.length === 0;
  const isAllSelected = safeData.length > 0 && selectedIds.size === safeData.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < safeData.length;

  return (
    <div className="w-full bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden relative">
      <div className="h-1 w-full bg-linear-to-r from-[#4A90E2] via-[#2ECC71] to-[#4A90E2]" />

      {(title || selectedIds.size > 0) && (
        <div className="bg-slate-800/30 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between min-h-[64px] transition-colors">
          <div>
            {title && selectedIds.size === 0 && <h3 className="font-bold text-white tracking-wide">{title}</h3>}
            {selectedIds.size > 0 && (
              <p className="text-sm font-semibold text-[#4A90E2]">
                {selectedIds.size} élément(s) sélectionné(s)
              </p>
            )}
          </div>
          {selectedIds.size > 0 && (
            <button className="text-sm font-bold text-[#E74C3C] hover:text-white bg-[#E74C3C]/10 hover:bg-[#E74C3C] px-4 py-2 rounded-lg transition-colors border border-[#E74C3C]/30 shadow-sm">
              Supprimer la sélection
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-700">
            <tr>
              {selectable && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#4A90E2] bg-slate-800 border-slate-600 rounded focus:ring-[#4A90E2] focus:ring-offset-slate-900 cursor-pointer"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>{col.header}</th>
              ))}
              {(onView || onEdit || onDelete || !onView) && (
                <th className="px-6 py-4 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {isEmpty ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + 1} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <FaBoxOpen size={48} className="mb-4 text-slate-600/50" />
                    <p className="font-medium text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              safeData.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.has(id);

                return (
                  <tr
                    key={id}
                    className={`hover:bg-slate-700/30 transition-colors group ${isSelected ? 'bg-[#4A90E2]/10' : ''}`}
                  >
                    {selectable && (
                      <td className="px-6 py-4 w-12 border-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#4A90E2] bg-slate-800 border-slate-600 rounded focus:ring-[#4A90E2] focus:ring-offset-slate-900 cursor-pointer"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(id, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td key={idx} className={`px-6 py-4 border-none text-slate-200 ${col.className || ''}`}>
                        {col.render ? col.render(item) : (col.accessorKey ? String(item[col.accessorKey] ?? '') : '')}
                      </td>
                    ))}

                    <td className="px-6 py-4 border-none">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="Voir les détails"
                          onClick={() => handleView(item)}
                          className="p-2 text-slate-400 hover:text-[#4A90E2] hover:bg-[#4A90E2]/10 rounded-lg transition-colors border border-transparent hover:border-[#4A90E2]/20"
                        >
                          <FaEye size={16} />
                        </button>
                        {onEdit && (
                          <button
                            title="Modifier"
                            onClick={() => onEdit(item)}
                            className="p-2 text-slate-400 hover:text-[#F39C12] hover:bg-[#F39C12]/10 rounded-lg transition-colors border border-transparent hover:border-[#F39C12]/20"
                          >
                            <FaEdit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            title="Supprimer"
                            onClick={() => setItemToDelete(item)}
                            className="p-2 text-slate-400 hover:text-[#E74C3C] hover:bg-[#E74C3C]/10 rounded-lg transition-colors border border-transparent hover:border-[#E74C3C]/20"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isEmpty && (
        <div className="bg-slate-900/40 border-t border-slate-700/50 px-6 py-4 flex items-center justify-between text-sm text-slate-400">
          <span>Total : <strong className="text-white font-bold">{safeData.length}</strong> éléments</span>
        </div>
      )}

      {/* 1. Modal details */}
      {internalViewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={() => setInternalViewItem(null)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4 bg-slate-800/30">
              <h3 className="text-lg font-bold text-white tracking-wide">Détails de l'élément</h3>
              <button onClick={() => setInternalViewItem(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {renderDetails ? renderDetails(internalViewItem) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-700/50">
                  {Object.entries(internalViewItem).filter(([k]) => k !== 'password').map(([key, val]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4 hover:bg-slate-800 transition-colors">
                      <span className="text-sm font-semibold text-[#4A90E2] capitalize w-1/3 shrink-0">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium text-slate-200 flex-1 break-words">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal de Confirmation de Suppression */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setItemToDelete(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#E74C3C]/10 rounded-full text-[#E74C3C]">
                <FaExclamationTriangle size={32} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Confirmation de suppression</h3>
            <p className="text-slate-400 text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#E74C3C] hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
