import React, { useState } from 'react';
import { LayoutDashboard, Settings, CalendarCheck, FileCheck, PieChart, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'daily', label: '일일 현황 기록', icon: CalendarCheck },
    { id: 'program', label: '프로그램 실적', icon: FileCheck },
    { id: 'master', label: '마스터 정보 설정', icon: Settings },
    { id: 'stats', label: '통계 분석', icon: PieChart },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden bg-[#1e293b] text-white p-4 flex justify-between items-center fixed top-0 w-full z-20">
        <div className="font-bold text-lg flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-500 rounded flex justify-center items-center text-white">S</div>
           스마트 사회복지 관리
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar background overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 w-64 h-full md:h-screen bg-[#1e293b] text-white
        transition-transform duration-300 z-20 shadow-xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-700/50 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex justify-center items-center text-white font-bold text-xl">S</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">스마트 사회복지</h1>
            <p className="text-xs text-slate-400">일일 관리 플랫폼</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 px-3 mt-16 md:mt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">v1.0.0 &copy; 2024</p>
        </div>
      </div>
    </>
  );
}
