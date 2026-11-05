import React from 'react';

export interface CyberToastData {
  readonly id: number;
  readonly text: string;
  readonly type: 'INFO' | 'WARN' | 'SUCCESS';
}

export interface CyberGamerToastProps {
  readonly toast: CyberToastData | null;
}

/**
 * High-tech floating cyber toast banner for immediate gamer tactical feedback.
 * Banner thông báo trạng thái nổi chuẩn Esports phản hồi tức thì mọi hành động của game thủ.
 */
export const CyberGamerToast: React.FC<CyberGamerToastProps> = ({ toast }) => {
  if (!toast) return null;

  const styleMap = {
    WARN: 'bg-amber-950/95 border-amber-400 text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.5)]',
    SUCCESS: 'bg-emerald-950/95 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.5)]',
    INFO: 'bg-cyan-950/95 border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(0,240,255,0.5)]'
  };

  return (
    <aside
      key={toast.id}
      aria-live="polite"
      className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl border shadow-2xl backdrop-blur-md font-mono text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-150 pointer-events-none select-none ${styleMap[toast.type]}`}
    >
      <span>{toast.text}</span>
    </aside>
  );
};
