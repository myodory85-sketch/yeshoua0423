import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, Briefcase, Save } from 'lucide-react';

export default function DailyEntry() {
  const { dailyAttendances, saveDailyAttendance } = useApp();
  
  // 오늘 날짜 기본값
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  
  const [staffMale, setStaffMale] = useState(0);
  const [staffFemale, setStaffFemale] = useState(0);
  const [usersPresent, setUsersPresent] = useState(0);
  const [usersAbsent, setUsersAbsent] = useState(0);

  // 날짜 변경 시 해당 날짜 데이터 불러오기
  useEffect(() => {
    const existing = dailyAttendances.find(d => d.date === date);
    if (existing) {
      setStaffMale(existing.staffMale);
      setStaffFemale(existing.staffFemale);
      setUsersPresent(existing.usersPresent);
      setUsersAbsent(existing.usersAbsent);
    } else {
      setStaffMale(0);
      setStaffFemale(0);
      setUsersPresent(0);
      setUsersAbsent(0);
    }
  }, [date, dailyAttendances]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyAttendance({ date, staffMale, staffFemale, usersPresent, usersAbsent });
    alert('저장되었습니다.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <Calendar size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">일일 현황 기록</h1>
          <p className="text-slate-500 text-sm">해당 일자의 직원 및 이용인 현황을 입력합니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 inline-block">
            <label className="block text-sm font-medium text-slate-700 mb-1">기준 일자</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-48 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
                <Briefcase size={20} className="text-blue-500" /> 직원 출근 현황
              </h3>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">남성 출근</label>
                  <span className="text-blue-600 font-bold">{staffMale} 명</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={staffMale}
                  onChange={(e) => setStaffMale(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <input type="number" min="0" value={staffMale} onChange={(e) => setStaffMale(Number(e.target.value))} className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-center" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">여성 출근</label>
                  <span className="text-blue-600 font-bold">{staffFemale} 명</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={staffFemale}
                  onChange={(e) => setStaffFemale(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <input type="number" min="0" value={staffFemale} onChange={(e) => setStaffFemale(Number(e.target.value))} className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-center" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
                <Users size={20} className="text-blue-500" /> 이용인 현황
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">출석 인원</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setUsersPresent(Math.max(0, usersPresent - 1))} className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 text-xl hover:bg-slate-100">-</button>
                  <input
                    type="number" min="0"
                    value={usersPresent}
                    onChange={(e) => setUsersPresent(Number(e.target.value))}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-center font-bold text-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button type="button" onClick={() => setUsersPresent(usersPresent + 1)} className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 text-xl hover:bg-slate-100">+</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">결석 인원</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setUsersAbsent(Math.max(0, usersAbsent - 1))} className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 text-xl hover:bg-slate-100">-</button>
                  <input
                    type="number" min="0"
                    value={usersAbsent}
                    onChange={(e) => setUsersAbsent(Number(e.target.value))}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-center font-bold text-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button type="button" onClick={() => setUsersAbsent(usersAbsent + 1)} className="w-10 h-10 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 text-xl hover:bg-slate-100">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" className="px-8 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-md text-lg">
              <Save size={20} /> 현황 등록 및 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
