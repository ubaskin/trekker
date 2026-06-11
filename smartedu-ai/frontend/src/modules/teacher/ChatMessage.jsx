import ReactMarkdown from 'react-markdown';

/**
 * Bitta chat xabari. AI javoblari Markdown sifatida render qilinadi.
 */
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-lg shadow-sm ${
          isUser ? 'bg-brand-500 text-white' : 'bg-emerald-100'
        }`}
      >
        {isUser ? '🧑‍🎓' : '🧑‍🏫'}
      </div>

      {/* Xabar tanasi */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-brand-500 text-white rounded-tr-sm'
            : 'bg-white border border-slate-200 rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <div className="markdown-body text-[15px]">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
