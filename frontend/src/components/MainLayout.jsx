import React from 'react';
import StockSidebar from './StockSidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <StockSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;