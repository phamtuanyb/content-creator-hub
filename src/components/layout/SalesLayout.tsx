import { Outlet } from 'react-router-dom';
import { SalesSidebar } from './SalesSidebar';

export function SalesLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <SalesSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
