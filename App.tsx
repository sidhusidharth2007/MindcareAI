import React, { useState, useCallback, useRef } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { MoodTracker } from './components/MoodTracker';
import { geminiService } from './services/geminiService';
import { Message, MoodEntry } from './types';
import { CRISIS_RESOURCES } from './constants';
import { 
  Send, 
  Heart, 
  Menu, 
  X, 
  PhoneCall, 
  Info, 
  ShieldAlert,
  BrainCircuit,
  AlertCircle,
  Key
} from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // Check if setup is correct
  const isConfigured = geminiService.hasApiKey();

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages([...newMessages, assistantMessage]);

      const stream = geminiService.sendMessageStream([...newMessages]);
      let fullText = '';
      let groundingUrls: { title: string; uri: string }[] = [];

      for await (const chunk of stream) {
        fullText += chunk.text || '';
        const chunks = chunk.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((c: any) => {
            if (c.web) groundingUrls.push({ title: c.web.title, uri: c.web.uri });
          });
        }
        const uniqueUrls = Array.from(new Map(groundingUrls.map(u => [u.uri, u])).values());

        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].role === 'model') {
            updated[lastIdx] = {
              ...updated[lastIdx],
              text: fullText,
              isStreaming: false,
              groundingUrls: uniqueUrls,
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        text: "I'm having trouble connecting. Please check your API key in GitHub Secrets.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
          <Key className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Setup Required</h1>
        <p className="text-slate-600 max-w-md mb-8">
          The Gemini API Key is missing. Please add your key to **GitHub Secrets** as <code>API_KEY</code> to enable the AI features.
        </p>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left w-full max-w-md">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" />
            Steps to fix:
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600">
            <li>Go to your GitHub Repository **Settings**</li>
            <li>Click **Secrets and variables > Actions**</li>
            <li>Add a **New repository secret**</li>
            <li>Name: <code>API_KEY</code></li>
            <li>Value: *Your Gemini API Key*</li>
            <li>Re-run the deployment in the **Actions** tab</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">MindcareAI</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            <MoodTracker onLogMood={(entry) => setMoodLogs(prev => [...prev, entry])} logs={moodLogs} />
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                <PhoneCall className="w-3 h-3" />
                Crisis Resources (India)
              </h3>
              <div className="space-y-3">
                {CRISIS_RESOURCES.map((resource, idx) => (
                  <div key={idx} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                    <p className="font-bold text-red-800 text-sm mb-1">{resource.name}</p>
                    <p className="text-red-600 text-sm font-semibold mb-2">{resource.number}</p>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-700 underline">Website</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 rounded-lg"><Menu className="w-6 h-6" /></button>
            <span className="font-bold text-slate-800">Support Chat</span>
          </div>
        </header>

        {showDisclaimer && (
          <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-center justify-center gap-3">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
            <p className="text-xs text-indigo-800 font-medium">MindcareAI is for support only. Not a medical clinical tool.</p>
            <button onClick={() => setShowDisclaimer(false)} className="p-1 text-indigo-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        <ChatWindow messages={messages} isLoading={isLoading} />

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5 pr-2 shadow-inner">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me how you're feeling..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-3"
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className={`p-3 rounded-xl ${!input.trim() || isLoading ? 'bg-slate-300' : 'bg-emerald-600 text-white'}`}>
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;