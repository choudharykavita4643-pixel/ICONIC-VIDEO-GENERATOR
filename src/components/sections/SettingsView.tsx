import React, { useState } from 'react';
import {
  Settings,
  Code2,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Apple,
  Cpu,
  ShieldCheck,
  RefreshCw,
  FolderArchive,
  ExternalLink,
} from 'lucide-react';
import { FLUTTER_CODEBASE, FlutterFile } from '../../data/flutterSourceCode';
import { storageService } from '../../services/storageService';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const SettingsView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_CODEBASE[0]);
  const [copied, setCopied] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Copy selected Flutter code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download single Flutter file
  const handleDownloadFile = (file: FlutterFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset sample data
  const handleResetData = () => {
    if (confirm('Reset your project library to default starter templates?')) {
      storageService.resetAllProjects();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Settings & Cross-Platform Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-platform deployment instructions, PWA installation, and complete Flutter + Dart source files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install PWA App</span>
            </button>
          )}
        </div>
      </div>

      {/* Cross-Platform Device Support Banner */}
      <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-white block">
          Universal Platform Target Architecture
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-semibold text-slate-200 block">Android</span>
              <span className="text-[10px] text-slate-400">PWA / Flutter APK</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Apple className="w-5 h-5 text-slate-200" />
            <div>
              <span className="font-semibold text-slate-200 block">iOS / iPadOS</span>
              <span className="text-[10px] text-slate-400">Safari WebClip / Xcode</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="font-semibold text-slate-200 block">Windows</span>
              <span className="text-[10px] text-slate-400">PWA App / Native .EXE</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <div>
              <span className="font-semibold text-slate-200 block">macOS</span>
              <span className="text-[10px] text-slate-400">Desktop / Native .APP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flutter & Dart Source Code Explorer */}
      <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Flutter & Dart Codebase Explorer</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Production Flutter project files with Provider state management, Google Gen AI SDK, and YouTube OAuth.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(selectedFile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFile.name}</span>
            </button>
          </div>
        </div>

        {/* File Navigator Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* File list sidebar */}
          <div className="lg:col-span-4 space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800/80 max-h-[440px] overflow-y-auto">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1 block">
              Project Files
            </span>
            {FLUTTER_CODEBASE.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex flex-col ${
                  selectedFile.path === file.path
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="font-semibold truncate">{file.name}</span>
                <span className="text-[10px] text-slate-400 font-sans truncate">
                  {file.path}
                </span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400">{selectedFile.path}</span>
              <span className="text-slate-400 text-[11px] font-sans">
                {selectedFile.description}
              </span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Security & Local Cache Reset */}
      <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Password & No Embedded Secrets Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Your authentication tokens are maintained exclusively in secure client storage and can be wiped instantly.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
        >
          {resetSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Templates Reset</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Starter Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
