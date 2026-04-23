import React from 'react';
import { useApp } from '../context/AppContext';
import { Database, Download, Upload, AlertCircle, RefreshCw } from 'lucide-react';

export default function Statistics() {
  const context = useApp();

  const handleExportJSON = () => {
    const dataObj = {
      programs: context.programs,
      dailyAttendances: context.dailyAttendances,
      programRecords: context.programRecords
    };
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `welfare_data_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Generate CSV for Program Records as an example
    let csv = "Record ID,Date,Program Name,Count,Participants\n";
    context.programRecords.forEach(r => {
      const pName = context.programs.find(p => p.id === r.programId)?.name || 'Unknown';
      csv += `${r.id},${r.date},"${pName}",${r.count},${r.participants}\n`;
    });

    const blob = new Blob(["\uFEFF"+csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `welfare_program_records_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm('기존 데이터를 덮어쓰게 됩니다. 계속하시겠습니까?')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === 'object') {
            context.importData({
              programs: parsed.programs || [],
              dailyAttendances: parsed.dailyAttendances || [],
              programRecords: parsed.programRecords || []
            });
            alert('데이터 로드가 완료되었습니다.');
          }
        } catch (error) {
          alert('올바르지 않은 백업 파일입니다.');
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
    // reset input
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <Database size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">통계 분석 & 데이터 관리</h1>
          <p className="text-slate-500 text-sm">데이터 백업, 복원 및 상세 통계 리포트 다운로드.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Download size={20} />
            <h3 className="text-lg font-bold text-slate-800">데이터 내보내기 (백업)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-6 line-clamp-3">
            브라우저 내부에 저장된 모든 정보(사업, 현황, 실적)를 안전하게 파일로 다운로드합니다. 시스템 교체 시 필수입니다.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={handleExportJSON} className="flex justify-between items-center px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg w-full text-slate-700 transition-colors">
              <span className="font-medium">전체 데이터 (JSON 포맷)</span>
              <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">복원용</span>
            </button>
            <button onClick={handleExportCSV} className="flex justify-between items-center px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg w-full text-slate-700 transition-colors">
              <span className="font-medium">프로그램 실적 리포트 (CSV/Excel)</span>
              <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">열람용</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Upload size={20} />
            <h3 className="text-lg font-bold text-slate-800">데이터 불러오기 (복원)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            이전에 백업한 JSON 파일을 업로드하여 데이터를 복구합니다.
          </p>
          
          <div className="flex-1 flex flex-col justify-end gap-4">
            <label className="flex justify-center items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Upload size={18} />
              <span className="font-medium">백업 파일(.json) 선택하기</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-amber-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>불러오기를 진행하면 현재 브라우저의 데이터는 파일 내용으로 완전히 교체됩니다.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
          <AlertCircle size={20} /> 위험 구역 (Danger Zone)
        </h3>
        <p className="text-sm text-red-600 mb-4">
          데이터를 초기화하면 모든 정보가 삭제되며 복구할 수 없습니다. 이 작업은 테스트 종료 후 실사용 시작 시 등에만 수행하세요.
        </p>
        <button onClick={context.resetData} className="px-5 py-2.5 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 hover:text-red-700 transition flex items-center gap-2">
          <RefreshCw size={18} /> 모든 데이터 초기화
        </button>
      </div>
    </div>
  );
}
