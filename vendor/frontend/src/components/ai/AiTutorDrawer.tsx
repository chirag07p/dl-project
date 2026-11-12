import React, { useState, useRef, useEffect } from 'react';
import { useDemoLearning } from '../../context';
import { BrainIcon, XIcon, ArrowRightIcon } from '../icons';
import { Button } from '../ui/Button';
import { cleanMarkdownSymbols, getSmartOfflineResponse } from '../../services/tutorKnowledge';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
  masteryContext?: string;
  learningStyle?: string;
}

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextQuestion?: {
    title: string;
    topic: string;
    codeSnippet?: string;
    isCorrect?: boolean;
  };
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  contextQuestion,
}) => {
  const { activeTopic, isBackendConnected, livePipelineData, askBackendTutor } = useDemoLearning();
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract current topic mastery from backend data
  const currentTopic = contextQuestion?.topic || activeTopic;
  const backendTopicKey = currentTopic.toLowerCase().includes('tree')
    ? 'trees'
    : currentTopic.toLowerCase().includes('recursion')
    ? 'recursion'
    : 'arrays';
  const topicMastery =
    livePipelineData?.profile.topic_masteries?.[backendTopicKey]?.mastery_score !== undefined
      ? Math.round(livePipelineData.profile.topic_masteries[backendTopicKey].mastery_score * 100)
      : null;

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text:
        "👋 Hello! I am your CogniPath AI Deep Learning Tutor. I continuously analyze your interaction patterns through our PyTorch DKT LSTM neural network. Ask me anything about problem invariants, time complexities, or your personalized learning roadmap!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || queryInput).trim();
    if (!textToSend || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text: textToSend, time: timeStr };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setQueryInput('');
    setIsLoading(true);

    try {
      const response = await askBackendTutor(textToSend, {
        topic: currentTopic,
        questionTitle: contextQuestion?.title,
        codeSnippet: contextQuestion?.codeSnippet,
        isCorrect: contextQuestion?.isCorrect,
      });

      if (response && response.answer) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: cleanMarkdownSymbols(response.answer),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            masteryContext: `${response.topic} Mastery: ${response.topic_mastery}% (${response.mastery_level})`,
            learningStyle: response.primary_style,
          },
        ]);
      } else {
        // Smart client-side response tailored to the exact question
        const smartAnswer = getSmartOfflineResponse(textToSend, currentTopic);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: smartAnswer,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            masteryContext: `${currentTopic} Focus`,
          },
        ]);
      }
    } catch {
      // Smart client-side response on network error
      const smartAnswer = getSmartOfflineResponse(textToSend, currentTopic);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: smartAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          masteryContext: `${currentTopic} Focus`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
              <BrainIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  CogniPath AI Tutor
                </h3>
                {isBackendConnected ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    PyTorch Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Local Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentTopic} {topicMastery !== null ? `• ${topicMastery}% DKT Mastery` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-b border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800/60 dark:bg-slate-950/40">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Suggested Prompts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSend("Why is the invariant right-- when sum > target?")}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
            >
              💡 Two-Pointer Invariant
            </button>
            <button
              type="button"
              onClick={() => handleSend("Explain the time and space complexity of this approach")}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
            >
              ⏱️ Time Complexity
            </button>
            <button
              type="button"
              onClick={() => handleSend("What topic should I practice next based on my weaknesses?")}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
            >
              🎯 Next Recommendation
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                {m.masteryContext && (
                  <div className="mb-2 flex flex-wrap items-center gap-1.5 border-b border-slate-200/60 pb-1.5 dark:border-slate-700/60">
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {m.masteryContext}
                    </span>
                    {m.learningStyle && (
                      <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Style: {m.learningStyle}
                      </span>
                    )}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{cleanMarkdownSymbols(m.text)}</div>
                <div
                  className={`mt-1 text-[9px] ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 p-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Querying DKT LSTM model & generating pedagogical answer...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="border-t border-slate-200 p-3 bg-white dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={`Ask AI Tutor about ${currentTopic}...`}
              className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={isLoading || !queryInput.trim()}
              rightIcon={<ArrowRightIcon size={14} />}
            >
              Ask
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
