import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, ShieldCheck, ArrowLeft, BarChart3 } from 'lucide-react';
import { runTestSuite, DETECTION_TEST_SUITE } from '../data/detectionTestSuite';
import { Language } from '../i18n/translations';

interface TestRunnerPageProps {
  onBack: () => void;
  language: Language;
}

export const TestRunnerPage: React.FC<TestRunnerPageProps> = ({ onBack, language }) => {
  const [testReport, setTestReport] = useState<ReturnType<typeof runTestSuite> | null>(() => runTestSuite());
  const [filter, setFilter] = useState<'ALL' | 'SUSPICIOUS' | 'LEGITIMATE'>('ALL');

  const handleRunTests = () => {
    const report = runTestSuite();
    setTestReport(report);
  };

  const filteredResults = testReport?.results.filter(r => {
    if (filter === 'ALL') return true;
    return r.category === filter;
  }) || [];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleRunTests}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-shield-teal text-white text-xs font-bold shadow transition"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Re-Run All 20 Tests</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-shield-teal" />
          False-Positive Defense & Detection Test Runner
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Evaluating 10 Scam attacks vs 10 Legitimate notifications containing "KYC", "OTP", and "Bank" keywords.
        </p>
      </div>

      {testReport && (
        <div className="bg-gradient-to-r from-shield-blue to-shield-card border border-shield-teal/40 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-shield-teal uppercase tracking-wider">
              Automated Test Results
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
              {testReport.passedCount} / {testReport.total} Passed ({testReport.accuracy}% Accuracy)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${testReport.accuracy}%` }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                filter === 'ALL' ? 'bg-shield-cyan text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              All (20)
            </button>
            <button
              onClick={() => setFilter('SUSPICIOUS')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                filter === 'SUSPICIOUS' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Scams (10)
            </button>
            <button
              onClick={() => setFilter('LEGITIMATE')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                filter === 'LEGITIMATE' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Legitimate Defense (10)
            </button>
          </div>
        </div>
      )}

      {/* Test Cases Table/List */}
      <div className="space-y-2.5">
        {filteredResults.map(r => (
          <div
            key={r.id}
            className="p-4 rounded-2xl bg-shield-card border border-shield-cardBorder text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {r.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className="font-bold text-white text-sm">{r.title}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  r.category === 'SUSPICIOUS'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {r.category}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-0.5">
              <span>Expected: <strong className="text-slate-200">{r.expected}</strong></span>
              <span>Actual: <strong className={r.actual === 'HIGH' || r.actual === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'}>{r.actual} ({r.score}/100)</strong></span>
            </div>

            <p className="text-slate-400 italic pt-1 text-[11px] leading-relaxed">
              Rationale: {r.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
