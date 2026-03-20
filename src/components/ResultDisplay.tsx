import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { IntentResult } from '../services/gemini';

interface ResultDisplayProps {
  result: IntentResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High': return <AlertTriangle className="w-5 h-5" />;
      case 'Medium': return <Info className="w-5 h-5" />;
      case 'Low': return <CheckCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl space-y-6 mt-8"
    >
      {/* Detected Intent */}
      <section 
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        aria-labelledby="intent-heading"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <h3 id="intent-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Detected Intent</h3>
        </div>
        <p className="text-lg font-medium text-slate-900 leading-relaxed">
          {result.detectedIntent}
        </p>
      </section>

      {/* Explanation */}
      <section 
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        aria-labelledby="explanation-heading"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <h3 id="explanation-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Explanation</h3>
        </div>
        <p className="text-slate-700 leading-relaxed italic">
          {result.explanation}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Level */}
        <section 
          className={cn(
            "rounded-2xl p-6 border transition-colors",
            getRiskColor(result.riskLevel)
          )}
          aria-labelledby="risk-heading"
        >
          <div className="flex items-center gap-2 mb-4">
            <span aria-hidden="true">{getRiskIcon(result.riskLevel)}</span>
            <h3 id="risk-heading" className="text-sm font-semibold uppercase tracking-wider opacity-80">Risk Level</h3>
          </div>
          <p className="text-2xl font-bold">{result.riskLevel}</p>
        </section>

        {/* Recommended Action */}
        <section 
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          aria-labelledby="action-heading"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <h3 id="action-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Recommended Action</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {result.recommendedAction}
          </p>
        </section>
      </div>

      {/* Relevant Services */}
      <section 
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        aria-labelledby="services-heading"
      >
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <h3 id="services-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-500">Relevant Services</h3>
        </div>
        <ul className="space-y-3" role="list">
          {result.relevantServices.map((service, idx) => (
            <li 
              key={idx} 
              className="flex items-center gap-3 text-slate-600 group cursor-default"
              role="listitem"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" aria-hidden="true" />
              <span className="flex-1">{service}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
}
