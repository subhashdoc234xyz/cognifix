import React, { useRef, useState } from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, FileUp, Layers, LoaderCircle, Network } from 'lucide-react';
import { DiagnosticLog, UserProfile, ViewMode } from '../types';

interface DashboardViewProps { user: UserProfile; logs: DiagnosticLog[]; onNavigate: (view: ViewMode) => void; accessToken: string | null; }
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024;
const acceptedTypes = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp']);

export const DashboardView: React.FC<DashboardViewProps> = ({ user, logs, onNavigate, accessToken }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const uploadFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) return setUploadMessage('Please choose a file smaller than 30 MB.');
    if (!acceptedTypes.has(file.type)) return setUploadMessage('Use a PDF, Word document, JPG, PNG, or WEBP image.');
    if (!accessToken) return setUploadMessage('Please sign in with Google again before uploading.');
    setIsUploading(true); setUploadMessage(null);
    try {
      const response = await fetch('/api/uploads/wrong-answer', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': file.type, 'X-File-Name': encodeURIComponent(file.name) }, body: file });
      const result = await response.json();
      setUploadMessage(response.ok ? `${file.name} uploaded. It is ready for your diagnostic review.` : result.error || 'Upload failed. Please try again.');
    } catch { setUploadMessage('Upload failed. Check your connection and try again.'); }
    finally { setIsUploading(false); }
  };

  return <div className="min-h-screen bg-[#f8f9ff] px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
    <div className="rounded-3xl bg-gradient-to-br from-[#08213d] to-[#075b85] p-8 text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">Your private workspace</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome{user.name ? `, ${user.name}` : ''}.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">There are no preloaded results here. Start a diagnostic when you are ready, and CogniFix will build your workspace from your own learning activity.</p><button onClick={() => onNavigate('practice-and-quiz')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#06213a]">Start your first diagnostic <ArrowRight className="h-4 w-4" /></button></div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-sm font-bold text-[#0b1c30]"><FileUp className="h-5 w-5 text-[#006096]" />Upload a wrong answer</div><p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">Upload your marked work or a screenshot so it is available for review. PDF, Word, JPG, PNG, or WEBP — up to 30 MB.</p></div><button onClick={() => inputRef.current?.click()} disabled={isUploading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#006096] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#007abc] disabled:cursor-wait disabled:opacity-60">{isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}{isUploading ? 'Uploading…' : 'Choose file'}</button></div><input ref={inputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp" onChange={(event) => { void uploadFile(event.target.files?.[0]); event.target.value = ''; }} />{uploadMessage && <p className={`mt-4 rounded-lg px-3 py-2 text-xs font-medium ${uploadMessage.includes('uploaded') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>{uploadMessage}</p>}</section>
    <div className="mt-8 grid gap-5 md:grid-cols-3">{[{ icon: BrainCircuit, title: 'Diagnostics', text: logs.length ? `${logs.length} learning record${logs.length === 1 ? '' : 's'} available.` : 'Your diagnostic history will appear here.' }, { icon: Network, title: 'Knowledge map', text: 'Concept connections will form as you learn.' }, { icon: Layers, title: 'Review deck', text: 'Your recall prompts will be saved here.' }].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5eeff] text-[#006096]"><Icon className="h-5 w-5" /></div><h2 className="mt-5 font-bold text-[#0b1c30]">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div>
    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><p>This is a fresh workspace. Only work you complete or upload will be shown as progress or results.</p></div>
  </div></div>;
};
