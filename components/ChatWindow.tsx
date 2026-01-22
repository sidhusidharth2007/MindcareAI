
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { Sparkles, User, AlertCircle, Link as LinkIcon } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to MindcareAI</h2>
          <p className="text-slate-500 max-w-md">
            I'm here to listen and provide support. You can talk to me about your day, stress, anxiety, or anything else on your mind.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
              "I've been feeling a bit overwhelmed lately..."
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
              "Can you suggest some breathing exercises?"
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              message.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}>
              {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            </div>
            
            <div className="flex flex-col gap-1">
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-none'
              }`}>
                {message.text || (message.isStreaming && <span className="animate-pulse">MindcareAI is typing...</span>)}
                
                {message.groundingUrls && message.groundingUrls.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Sources & Resources</p>
                    <div className="space-y-1">
                      {message.groundingUrls.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-emerald-600 hover:underline"
                        >
                          <LinkIcon className="w-3 h-3" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className={`text-[10px] text-slate-400 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && messages[messages.length-1]?.role === 'user' && (
        <div className="flex justify-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 w-24">
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
