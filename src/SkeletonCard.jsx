function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
    </div>
  );
}

export default SkeletonCard;
