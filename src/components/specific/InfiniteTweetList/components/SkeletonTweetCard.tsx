export const SkeletonTweetCard = ({}) => {
  return (
    <div className="flex w-full gap-4 border-b px-4 py-4">
      <div className="flex h-24 w-full animate-pulse space-x-4">
        <div className="h-12 w-12 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 h-2 rounded bg-slate-200"></div>
            <div className="col-span-1 h-2 rounded bg-slate-200"></div>
          </div>
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="space-y-3">
            <div className="h-2 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
