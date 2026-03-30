/**
 * Skeleton loader compact pour le Profil Hub
 */
export function ProfileSkeleton() {
  return (
    <div className="w-full bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm border border-slate-700/50 overflow-hidden relative animate-pulse">
      {/* Accent Line */}
      <div className="h-1 w-full bg-slate-700/50" />
      
      <div className="p-5 space-y-6">
        {/* Compact Header Skeleton */}
        <div className="flex items-center justify-between border-b border-slate-700/20 pb-4">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-slate-700 rounded-lg" />
            <div className="h-3 w-48 bg-slate-700 rounded opacity-40" />
          </div>
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
            <div className="h-8 w-16 bg-slate-700 rounded-md" />
            <div className="h-8 w-16 bg-slate-700 rounded-md" />
            <div className="h-8 w-16 bg-slate-700 rounded-md" />
          </div>
        </div>

        {/* Section Content Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-slate-700 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-700 rounded" />
              <div className="h-3 w-64 bg-slate-700 rounded opacity-50" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-2 w-12 bg-slate-700 rounded" />
                <div className="h-9 w-full bg-slate-700 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-12 bg-slate-700 rounded" />
                <div className="h-9 w-full bg-slate-700 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-16 bg-slate-700 rounded" />
              <div className="h-9 w-full bg-slate-700 rounded-lg" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <div className="h-9 w-32 bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
