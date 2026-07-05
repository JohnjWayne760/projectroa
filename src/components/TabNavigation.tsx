import { Sword, Flame } from 'lucide-react';
import type { TabType } from '../types.ts';
import { clsx } from 'clsx';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <nav className="flex w-full border-b-2 border-[#b89346]">
      <button 
        className={clsx(
          "tab-btn flex items-center justify-center gap-3 group",
          activeTab === 'portador' && "active red-theme"
        )}
        onClick={() => setActiveTab('portador')}
      >
        <Sword className={clsx("w-6 h-6 transition-transform group-hover:scale-110", activeTab === 'portador' ? "text-red-300" : "text-gray-500")} />
        El Portador
      </button>
      
      <button 
        className={clsx(
          "tab-btn flex items-center justify-center gap-3 group",
          activeTab === 'avatar' && "active blue-theme"
        )}
        onClick={() => setActiveTab('avatar')}
      >
        <Flame className={clsx("w-6 h-6 transition-transform group-hover:scale-110", activeTab === 'avatar' ? "text-blue-300" : "text-gray-500")} />
        El Avatar
      </button>
      
      {import.meta.env.DEV && (
        <button 
          className={clsx(
            "tab-btn flex items-center justify-center gap-3 group",
            activeTab === 'editor' && "active bg-gray-800 text-white border-gray-500 shadow-[0_0_10px_rgba(156,163,175,0.5)]"
          )}
          onClick={() => setActiveTab('editor')}
        >
          <span className={clsx("transition-transform group-hover:scale-110 font-bold", activeTab === 'editor' ? "text-gray-300" : "text-gray-500")}>⚙️ Editor</span>
        </button>
      )}
    </nav>
  );
}
