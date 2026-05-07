import * as React from "react";

interface TabBarProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }: TabBarProps) => {
  return (
    <div className="flex justify-center mb-4 bg-gray-100 rounded-lg shadow">
      {tabs.map((tab: string, idx: number) => (
        <button
          key={tab}
          className={
            `flex-1 py-3 px-6 text-base font-medium rounded-t-lg transition-colors duration-200 cursor-pointer ` +
            (activeTab === idx
              ? "bg-white text-blue-600 font-bold shadow"
              : "bg-transparent text-gray-700 hover:bg-gray-200")
          }
          onClick={() => onTabChange(idx)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
