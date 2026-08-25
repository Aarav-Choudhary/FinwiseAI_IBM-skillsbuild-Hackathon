import { Sparkles, User } from "lucide-react";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 my-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-primary text-white"
            : "bg-surface border border-border text-primary"
        }`}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      <div className={`space-y-1 max-w-[80%] ${isUser ? "items-end flex flex-col" : "items-start"}`}>
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "chat-bubble-user"
              : "chat-bubble-bot glass"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="flex items-center gap-2 px-1 text-[10px] text-textSecondary">
          <span>{message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {!isUser && message.model && (
            <span className="flex items-center gap-1 text-blue-400/80">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <rect x="0" y="5" width="24" height="3" />
                <rect x="3" y="10.5" width="18" height="3" />
                <rect x="0" y="16" width="24" height="3" />
              </svg>
              {message.model}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
