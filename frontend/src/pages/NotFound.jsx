import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-14 text-center text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl rounded-[36px] border border-slate-800 bg-slate-950/95 p-14 shadow-2xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Page not found</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">404</h1>
        <p className="mt-4 text-lg text-slate-400">The page you are looking for can’t be found, but you can return to the dashboard.</p>
        <div className="mt-8 flex justify-center">
          <Link to="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
