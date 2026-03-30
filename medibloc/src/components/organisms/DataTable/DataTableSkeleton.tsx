export default function DataTableSkeleton({ columns = 5, rows = 6 }: { columns?: number, rows?: number }) {
  return (
    <div className="w-full bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden relative">
      <div className="h-1 w-full bg-slate-800" />
      
      {/* Header Skeleton */}
      <div className="bg-slate-800/30 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
        <div className="w-48 h-5 bg-slate-700 rounded animate-pulse"></div>
        <div className="w-24 h-8 bg-slate-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Table Header */}
      <div className="bg-slate-900/50 border-b border-slate-700 flex items-center px-6 py-3 gap-4">
        <div className="w-4 h-4 rounded bg-slate-700 animate-pulse shrink-0"></div>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`th-${i}`} className="flex-1 h-4 bg-slate-700 rounded animate-pulse"></div>
        ))}
        {/* Actions spacer */}
        <div className="w-24 shrink-0"></div>
      </div>

      {/* Rows Skeletons */}
      <div className="divide-y divide-slate-700/50">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center px-6 py-4 gap-4 animate-pulse">
            {/* Checkbox */}
            <div className="w-4 h-4 rounded bg-slate-800 shrink-0"></div>
            
            {/* Columns */}
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`col-${colIndex}`} className="flex-1">
                <div className={`h-4 bg-slate-700 rounded ${colIndex === 0 ? 'w-3/4' : 'w-1/2'}`}></div>
              </div>
            ))}
            
            {/* Action Buttons */}
            <div className="w-24 flex items-center justify-end gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
              <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
              <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Skeleton */}
      <div className="bg-slate-900/40 border-t border-slate-700/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-32 h-4 bg-slate-700 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded bg-slate-700 animate-pulse"></div>
          <div className="w-8 h-8 rounded bg-slate-700 animate-pulse"></div>
          <div className="w-8 h-8 rounded bg-slate-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}