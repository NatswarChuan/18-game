import React, { useEffect, useRef } from 'react';
import { CombatEventItem } from '@valkyrie/shared-domain';

interface CombatLogProps {
  readonly events: readonly CombatEventItem[];
  readonly isOpen?: boolean | undefined;
  readonly onClose?: (() => void) | undefined;
}

/**
 * Slide-out Right Drawer Combat Log (20Hz Telemetry & Events).
 * Ngăn kéo hiển thị nhật ký giao tranh thời gian thực 20Hz trượt từ cạnh phải.
 */
export const CombatLog: React.FC<CombatLogProps> = ({ events, isOpen = true, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  if (!isOpen) return null;

  const exportTelemetry = () => {
    if (events.length === 0) return;
    const blob = new Blob(
      [JSON.stringify({ timestamp: Date.now(), totalEvents: events.length, events }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valkyrie_telemetry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 md:w-96 glass-panel border-l border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col p-4 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
          <span className="text-[#00F0FF]">⚡</span> NHẬT KÝ CHIẾN TRƯỜNG 20HZ
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">
            {events.length} SỰ KIỆN
          </span>
          {events.length > 0 && (
            <button
              onClick={exportTelemetry}
              className="px-2 py-0.5 rounded text-[9px] font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-[#00F0FF]/20 border border-white/20 transition-colors"
              title="Xuất nhật ký chiến đấu JSON"
            >
              💾 JSON
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-6 h-6 rounded bg-white/10 hover:bg-[#FF2A85] text-gray-400 hover:text-white flex items-center justify-center transition-colors text-xs"
              title="Đóng nhật ký"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Events List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
        {events.length === 0 ? (
          <div className="text-gray-500 italic text-[11px] py-8 text-center">
            Đang chờ giao tranh khai hỏa...
          </div>
        ) : (
          events.map((ev, index) => {
            let badgeColor = 'text-gray-300 bg-gray-800';
            if (ev.eventType === 'ATTACK') badgeColor = 'text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30';
            if (ev.eventType === 'CLOTH_TIER_CHANGED') badgeColor = 'text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 font-bold';
            if (ev.eventType === 'ULTIMATE_CAST') badgeColor = 'text-[#FF2A85] bg-[#FF2A85]/20 border border-[#FF2A85] font-bold animate-pulse';
            if (ev.eventType === 'UNIT_DEFEATED') badgeColor = 'text-red-400 bg-red-950/40 border border-red-500/30';

            return (
              <div key={index} className="flex items-start gap-1.5 text-[10px] leading-relaxed p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-gray-500 font-mono text-[9px] flex-shrink-0">T+{ev.tick}</span>
                <span className={`px-1 rounded text-[8px] uppercase font-bold flex-shrink-0 ${badgeColor}`}>
                  {ev.eventType.replace('_', ' ')}
                </span>
                <span className="text-gray-200 flex-1 break-words">
                  {ev.message ?? `Event: ${ev.eventType}`}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
