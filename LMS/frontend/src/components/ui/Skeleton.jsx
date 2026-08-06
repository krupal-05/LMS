import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`skeleton-shimmer rounded-lg ${className}`} />
  );
};

export const BookCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
    <Skeleton className="w-full h-48 rounded-xl" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-slate-800/60">
    <td className="p-4"><Skeleton className="h-5 w-36" /></td>
    <td className="p-4"><Skeleton className="h-5 w-24" /></td>
    <td className="p-4"><Skeleton className="h-5 w-20" /></td>
    <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
    <td className="p-4 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
  </tr>
);

export const StatCardSkeleton = () => (
  <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
    <Skeleton className="w-12 h-12 rounded-xl" />
  </div>
);

export default Skeleton;
