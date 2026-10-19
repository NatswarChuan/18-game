import React, { useEffect, useRef } from 'react';
import { CombatEventItem } from '@valkyrie/shared-domain';

interface CombatLogProps {
  readonly events: readonly CombatEventItem[];
}

export const CombatLog: React.FC<CombatLogProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

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
    <div className="glass-panel p-4 border border-white/10 flex flex-col h-[280px]">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
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
              className="px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-[#00F0FF]/20 border border-white/20 transition-colors"
              title="Xuất nhật ký chiến đấu JSON"
            >
              💾 JSON
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
        {events.length === 0 ? (
          <div className="text-gray-500 italic text-[11px] py-4 text-center">
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
              <div key={index} className="flex items-start gap-2 text-[11px] leading-relaxed">
                <span className="text-gray-500 text-[10px]">T+{ev.tick}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase ${badgeColor}`}>
                  {ev.eventType.replace('_', ' ')}
                </span>
                <span className="text-gray-200 flex-1">
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
