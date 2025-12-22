import { Outlet } from 'react-router-dom';
import { UserHeader } from './UserHeader';
import { UserSidebar } from './UserSidebar';

export function UserLayout() {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <div className="flex">
        <UserSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
