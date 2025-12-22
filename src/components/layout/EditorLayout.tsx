import { Outlet } from 'react-router-dom';
import { EditorSidebar } from './EditorSidebar';

export function EditorLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <EditorSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
