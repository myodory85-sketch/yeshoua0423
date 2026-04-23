import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, UserCheck, Activity, CheckSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

export default function Dashboard() {
  const { programs, programRecords, dailyAttendances } = useApp();

  const totalPrograms = programs.length;
  
  // 전체 누적 계산
  const overallStats = useMemo(() => {
    const totalRecords = programRecords.reduce((acc, curr) => ({
      count: acc.count + curr.count,
      participants: acc.participants + curr.participants
    }), { count: 0, participants: 0 });

    const totalTargets = programs.reduce((acc, curr) => ({
      count: acc.count + curr.targetCount,
      participants: acc.participants + curr.targetParticipants
    }), { count: 0, participants: 0 });

    return { records: totalRecords, targets: totalTargets };
  }, [programs, programRecords]);

  // 최근 7일 출석 그래프 데이터
  const attendanceData = useMemo(() => {
    const sorted = [...dailyAttendances].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-7).map(d => ({
      date: d.date.substring(5), // MM-DD
      출석: d.usersPresent,
      결석: d.usersAbsent,
      총직원: d.staffMale + d.staffFemale
    }));
  }, [dailyAttendances]);

  // 프로그램별 달성 차트 데이터
  const programChartData = useMemo(() => {
    return programs.map(p => {
      const records = programRecords.filter(r => r.programId === p.id);
      const accParticipants = records.reduce((sum, r) => sum + r.participants, 0);
      const achievementRate = p.targetParticipants > 0 ? (accParticipants / p.targetParticipants) * 100 : 0;
      return {
        name: p.name,
        목표: p.targetParticipants,
        누적: accParticipants,
        달성률: Math.min(100, Math.round(achievementRate)),
        fill: achievementRate >= 100 ? '#10b981' : '#3b82f6'
      };
    });
  }, [programs, programRecords]);


  const countRate = overallStats.targets.count > 0 ? ((overallStats.records.count / overallStats.targets.count) * 100).toFixed(1) : 0;
  const partRate = overallStats.targets.participants > 0 ? ((overallStats.records.participants / overallStats.targets.participants) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">종합 대시보드</h1>
          <p className="text-slate-500 text-sm">연간 실적 및 일일 기록에 대한 요약 통계입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">관리 사업 수</p>
            <p className="text-2xl font-bold text-slate-800">{totalPrograms}개</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">총 진행 건수 (연간)</p>
            <p className="text-2xl font-bold text-slate-800">{overallStats.records.count.toLocaleString()}건</p>
            <p className="text-xs text-slate-400 mt-1">목표: {overallStats.targets.count.toLocaleString()} ({countRate}%)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 md:col-span-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 font-medium">참여 연인원 (연간)</p>
            <div className="flex items-end gap-3">
              <p className="text-2xl font-bold text-slate-800">{overallStats.records.participants.toLocaleString()}명</p>
              <div className="flex-1 pb-1">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>진행률</span>
                  <span>{partRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, Number(partRate))}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 출석 현황 그래프 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserCheck size={18} className="text-blue-500" /> 최근 7일 이용인 출석 동향
          </h3>
          <div className="flex-1 w-full h-full min-h-0">
            {attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                  <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="출석" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="결석" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">데이터가 없습니다.</div>
            )}
          </div>
        </div>

        {/* 프로그램 목표 달성률 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-emerald-500" /> 사업별 인원 목표 달성률 (%)
          </h3>
          <div className="flex-1 w-full h-full min-h-0">
             {programChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programChartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                  <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                  <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="달성률" radius={[0, 4, 4, 0]} barSize={20}>
                    {
                      programChartData.map((entry, index) => (
                        <cell key={`cell-${index}`} fill={entry.fill} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


