import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MobileSidebar from '../components/layout/MobileSidebar';

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-full flex-col gap-4 px-3 py-4 sm:px-4 sm:py-5 xl:flex-row xl:gap-6 xl:px-8 xl:py-6">
        <Sidebar />
        <main className="flex-1 min-w-0 space-y-4 sm:space-y-6">
          <Navbar onToggleMobile={() => setMobileOpen(true)} />
          <div className="overflow-x-hidden">{children}</div>
        </main>
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </div>
  );
};

export default DashboardLayout;
