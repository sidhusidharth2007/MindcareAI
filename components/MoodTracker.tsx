
import React, { useState } from 'react';
import { MOOD_DATA } from '../constants';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  onLogMood: (entry: MoodEntry) => void;
  logs: MoodEntry[];
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ onLogMood, logs }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodClick = (moodValue: string) => {
    const entry: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      mood: moodValue as any,
    };
    onLogMood(entry);
    setSelectedMood(moodValue);
    setTimeout(() => setSelectedMood(null), 2000); // Feedback timeout
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-emerald-500">How are you feeling today?</span>
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {MOOD_DATA.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodClick(mood.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              selectedMood === mood.value ? 'ring-2 ring-emerald-500 bg-emerald-50' : mood.color
            }`}
          >
            <span className="text-3xl mb-1">{mood.icon}</span>
            <span className="text-xs font-medium uppercase tracking-wider">{mood.label}</span>
          </button>
        ))}
      </div>

      {logs.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Logs</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {logs.slice().reverse().map((log) => {
              const moodInfo = MOOD_DATA.find(m => m.value === log.mood);
              return (
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{moodInfo?.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{moodInfo?.label}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
