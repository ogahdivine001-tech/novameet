import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane, HiX } from 'react-icons/hi';
import { formatTime } from '../utils/formatDate';
import EmptyState from './EmptyState';
import { HiChatAlt2 } from 'react-icons/hi';

const ChatPanel = ({ messages, onSend, currentUserId, onClose }) => {
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--color-border))]">
        <h3 className="font-semibold text-sm text-[rgb(var(--color-text-primary))]">
          In-call messages
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]/60 focus-ring md:hidden"
          aria-label="Close chat"
        >
          <HiX />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <EmptyState icon={HiChatAlt2} title="No messages yet" description="Say hello to get the conversation started." />
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                    {isOwn ? 'You' : msg.senderName}
                  </span>
                  <span className="text-[10px] text-[rgb(var(--color-text-secondary))]">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm break-words ${
                    isOwn
                      ? 'bg-nova-600 text-white rounded-tr-sm'
                      : 'bg-[rgb(var(--color-border))]/60 text-[rgb(var(--color-text-primary))] rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[rgb(var(--color-border))] flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message..."
          className="input-field flex-1"
          aria-label="Chat message"
        />
        <button type="submit" className="btn btn-primary px-3" aria-label="Send message" disabled={!text.trim()}>
          <HiPaperAirplane className="rotate-90" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
