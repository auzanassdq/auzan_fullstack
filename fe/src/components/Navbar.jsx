import logoFtl from '../assets/logo-ftl.png';
import avatar from '../assets/avatar.png';
import { BellIcon, ChevronDownIcon } from './Icons';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-linear-to-r from-[#111827] to-[#296377]">
      {/* Left: Logo + App name */}
      <div className="flex items-center gap-3">
        <img src={logoFtl} alt="FTL Logo" className="h-7 object-contain" />
        <span className="text-white font-medium text-base tracking-wide">iMeeting</span>
      </div>

      {/* Right: Bell + User */}
      <div className="flex items-center gap-4">
        <button className="text-gray-300 hover:text-white transition-colors relative" title="Notifikasi">
          <BellIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity">
          <img src={avatar} alt="John Doe" className="w-8 h-8 rounded-full object-cover border-2 border-[#4A8394]" />
          <span className="text-sm font-medium">John Doe</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-300" />
        </div>
      </div>
    </header>
  );
}
