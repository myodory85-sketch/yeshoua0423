import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

export default function ProgramEntry() {
  const { programs, programRecords, addProgramRecord, removeProgramRecord } = useApp();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [programId, setProgramId] = useState('');
  const [count, setCount] = useState(0);
  const [participants, setParticipants] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) {
      alert('사업을 선택해주세요.');
      return;
    }
    
    addProgramRecord({
      id: crypto.randomUUID(),
      date,
      programId,
      count: Number(count),
      participants: Number(participants)
    });
    
    // 리셋
    setCount(0);
    setParticipants(0);
  };

  const selectedProgram = programs.find(p => p.id === programId);

  // 연간 누계 계산
  const currentTotal = useMemo(() => {
    if (!programId) return { count: 0, participants: 0 };
    return programRecords
      .filter(r => r.programId === programId)
      .reduce((acc, curr) => ({
        count: acc.count + curr.count,
        participants: acc.participants + curr.participants
      }), { count: 0, participants: 0 });
  }, [programId, programRecords]);

  // 오늘 입력한 내역 (선택한 날짜 기준)
  const todaysRecords = useMemo(() => {
    return programRecords
      .filter(r => r.date === date)
      .sort((a,b) => b.id.localeCompare(a.id));
  }, [date, programRecords]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <CheckSquare size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">프로그램 실적 기록</h1>
          <p className="text-slate-500 text-sm">사업별 진행 실적(건수 및 참여 인원)을 기록합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">실적 일자</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">진행 사업 선택</label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    required
                  >
                    <option value="" disabled>사업을 선택하세요</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">오늘의 진행 건수</label>
                  <input
                    type="number" min="0" step="1"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-center text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="예: 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">참여 연인원</label>
                  <input
                    type="number" min="0" step="1"
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-center text-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="예: 15"
                  />
                </div>
              </div>

              <button type="submit" disabled={!programId} className="w-full py-3.5 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl font-medium transition-colors flex justify-center items-center gap-2 shadow-sm text-lg mt-4">
                <Plus size={20} /> 실적 추가하기
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800 flex justify-between items-center">
                <span>선택일({date}) 기록 내역</span>
                <span className="text-sm font-normal text-slate-500">총 {todaysRecords.length}건</span>
              </h3>
            </div>
            <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {todaysRecords.length === 0 ? (
                <li className="p-8 text-center text-slate-500">이 날짜에 기록된 실적이 없습니다.</li>
              ) : (
                todaysRecords.map(r => {
                  const pName = programs.find(x => x.id === r.programId)?.name || '삭제된 사업';
                  return (
                    <li key={r.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800">{pName}</p>
                        <p className="text-xs text-slate-500 mt-1">건수: {r.count}건 / 인원: {r.participants}명</p>
                      </div>
                      <button onClick={() => { if(window.confirm('삭제하시겠습니까?')) removeProgramRecord(r.id) }} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white hover:border hover:border-red-200 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </div>

        {/* 선택된 사업 진행률 요약 패널 */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 text-white overflow-hidden flex flex-col pt-2 h-fit sticky top-6">
          <div className="p-5 border-b border-slate-700">
            <h3 className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">실시간 누적 분석</h3>
            <h2 className="text-xl font-bold">{selectedProgram ? selectedProgram.name : '사업을 선택하세요'}</h2>
          </div>
          
          {selectedProgram ? (
            <div className="p-5 flex-1 flex flex-col gap-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">누적 건수</span>
                  <span className="font-mono text-slate-300">{currentTotal.count} / {selectedProgram.targetCount}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-400 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (currentTotal.count / selectedProgram.targetCount) * 100 || 0)}%` }}></div>
                </div>
                <div className="text-right text-xs text-blue-300">
                  달성률 {selectedProgram.targetCount ? ((currentTotal.count / selectedProgram.targetCount) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">누적 참여 인원</span>
                  <span className="font-mono text-slate-300">{currentTotal.participants} / {selectedProgram.targetParticipants}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-400 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (currentTotal.participants / selectedProgram.targetParticipants) * 100 || 0)}%` }}></div>
                </div>
                <div className="text-right text-xs text-emerald-300">
                  달성률 {selectedProgram.targetParticipants ? ((currentTotal.participants / selectedProgram.targetParticipants) * 100).toFixed(1) : 0}%
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 text-center">이 패널은 실적 등록 시 자동 업데이트됩니다.</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 flex-1 flex flex-col justify-center">
              좌측에서 진행 사업을 선택하시면 연간 목표 대비 실시간 달성률을 확인할 수 있습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
