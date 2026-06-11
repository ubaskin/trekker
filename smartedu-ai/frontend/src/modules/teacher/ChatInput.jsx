import { useState } from 'react';

/**
 * Xabar yozish maydoni. Enter — yuborish, Shift+Enter — yangi qator.
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="px-6 py-4 bg-white border-t border-slate-200">
      <div className="flex items-end gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Savolingizni yozing... (masalan: Fotosintez nima?)"
          className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 placeholder:text-slate-400"
        />
        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="px-5 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Yuborish ➤
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        Enter — yuborish · Shift+Enter — yangi qator
      </p>
    </div>
  );
}
