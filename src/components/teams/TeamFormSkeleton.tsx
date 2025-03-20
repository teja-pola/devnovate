
import React from 'react';

export const TeamFormSkeleton = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 mx-auto"></div>
      </div>
    </div>
  );
};
