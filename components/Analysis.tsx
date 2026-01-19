
import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, AlertTriangle, TrendingUp, Compass } from 'lucide-react';
import { Trade } from '../types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AnalysisProps {
  trades: Trade[];
}

const Analysis: React.FC<AnalysisProps> = ({ trades }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const performAnalysis = async () => {
    if (trades.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const tradesSummary = trades.map(t => ({
        symbol: t.symbol,
        pnl: t.pnl,
        strategy: t.strategy,
        side: t.side,
        notes: t.notes
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze these trades from my trading journal. Identify strengths, weaknesses, psychological patterns, and suggestions for strategy improvement. Focus on risk management and consistent patterns.
        
        Trade History:
        ${JSON.stringify(tradesSummary, null, 2)}
        
        Provide the response in a structured Markdown format with sections for:
        1. Performance Summary
        2. Strategy Effectiveness
        3. Risk Management Review
        4. Psychological Insights (based on notes)
        5. Actionable Recommendations`,
        config: {
          systemInstruction: "You are a world-class trading performance coach and analyst. Your tone is objective, professional, and supportive.",
          temperature: 0.7,
        }
      });

      setAnalysis(response.text || "No analysis generated.");
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAnalysis("An error occurred during analysis. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-900/20 via-zinc-900 to-zinc-900 border border-indigo-500/20 rounded-3xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-600/20 rounded-2xl">
            <BrainCircuit className="w-10 h-10 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">AI Performance Coach</h2>
        <p className="text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Leverage Gemini to analyze your trade history, uncover hidden biases, and get personalized coaching to improve your edge.
        </p>
        
        <button 
          onClick={performAnalysis}
          disabled={isAnalyzing || trades.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-900/30 flex items-center gap-3 mx-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Trade History...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Full Analysis</span>
            </>
          )}
        </button>
        {trades.length === 0 && (
          <p className="text-xs text-rose-400 mt-4 font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
            <AlertTriangle className="w-3 h-3" />
            Add some trades first to unlock AI insights
          </p>
        )}
      </div>

      {analysis && (
        <div className="bg-[#0d0d0f] border border-zinc-800 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="prose prose-invert prose-indigo max-w-none">
            {analysis.split('\n').map((line, i) => {
              if (line.startsWith('###')) {
                return <h3 key={i} className="text-xl font-bold text-indigo-400 mt-8 mb-4">{line.replace('###', '')}</h3>;
              }
              if (line.startsWith('##')) {
                return <h2 key={i} className="text-2xl font-bold text-zinc-100 border-b border-zinc-800 pb-2 mt-10 mb-6">{line.replace('##', '')}</h2>;
              }
              if (line.startsWith('1.') || line.match(/^\d+\./)) {
                return <p key={i} className="ml-4 mb-2 text-zinc-300"><span className="font-bold text-indigo-400 mr-2">{line.match(/^\d+\./)}</span> {line.replace(/^\d+\.\s+/, '')}</p>;
              }
              if (line.trim().startsWith('-')) {
                return <li key={i} className="text-zinc-300 ml-6 mb-2 list-none flex gap-3">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{line.trim().substring(1)}</span>
                </li>;
              }
              return <p key={i} className="mb-4 text-zinc-400 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      )}

      {/* Helper Tiles */}
      {!analysis && !isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm uppercase tracking-widest">Edge Discovery</h4>
            </div>
            <p className="text-sm text-zinc-500">Gemini will identify which market conditions and strategies are yielding your highest R-multiples.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-5 h-5 text-sky-400" />
              <h4 className="font-bold text-sm uppercase tracking-widest">Bias Identification</h4>
            </div>
            <p className="text-sm text-zinc-500">Analyze notes for emotional triggers like FOMO or revenge trading to build better psychological discipline.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
