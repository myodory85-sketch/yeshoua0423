import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Program } from '../types';
import { Settings, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function MasterSettings() {
  const { programs, addProgram, removeProgram, updateProgram } = useApp();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', targetCount: 0, targetParticipants: 0 });

  const resetForm = () => setFormData({ name: '', targetCount: 0, targetParticipants: 0 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addProgram({
      id: crypto.randomUUID(),
      name: formData.name,
      targetCount: Number(formData.targetCount),
      targetParticipants: Number(formData.targetParticipants)
    });
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!formData.name) return;
    updateProgram({
      id,
      name: formData.name,
      targetCount: Number(formData.targetCount),
      targetParticipants: Number(formData.targetParticipants)
    });
    setIsEditing(null);
    resetForm();
  };

  const startEdit = (p: Program) => {
    setIsEditing(p.id);
    setFormData({ name: p.name, targetCount: p.targetCount, targetParticipants: p.targetParticipants });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">마스터 정보 설정</h1>
          <p className="text-slate-500 text-sm">연간 사업 및 주요 목표를 성정합니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 text-slate-800 font-semibold">
          {isEditing ? '사업 정보 수정' : '신규 사업 추가'}
        </div>
        <div className="p-5">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={isEditing ? (e) => handleUpdate(e, isEditing) : handleAdd}>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">사업명</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="예: 어르신 나들이 지원"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">목표 건수 (연간)</label>
              <input
                type="number"
                min="0"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.targetCount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCount: Number(e.target.value) }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">목표 인원 (연간)</label>
              <input
                type="number"
                min="0"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={formData.targetParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, targetParticipants: Number(e.target.value) }))}
                required
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2 mt-2">
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <X size={18} /> 취소
                </button>
              )}
              <button type="submit" className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                {isEditing ? <Save size={18} /> : <Plus size={18} />}
                {isEditing ? '저장하기' : '추가하기'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">사업명</th>
              <th className="p-4 font-semibold w-32 text-right">목표 건수</th>
              <th className="p-4 font-semibold w-32 text-right">목표 인원</th>
              <th className="p-4 font-semibold w-24 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  등록된 사업이 없습니다. 새로운 사업을 추가해주세요.
                </td>
              </tr>
            ) : (
              programs.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-800 font-medium">{p.name}</td>
                  <td className="p-4 text-slate-600 text-right">{p.targetCount.toLocaleString()}건</td>
                  <td className="p-4 text-slate-600 text-right">{p.targetParticipants.toLocaleString()}명</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-md border border-slate-200 hover:border-blue-300 transition-colors" title="수정">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => { if(window.confirm('정말 삭제하시겠습니까?')) removeProgram(p.id) }} className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-md border border-slate-200 hover:border-red-300 transition-colors" title="삭제">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
