import React from 'react';

interface TacticalGuideModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * Tactical Rules & 3x3 Mechanics Guide Modal.
 * Hướng dẫn quy tắc chiến thuật 3x3 và cơ chế tổn hại giáp 16+.
 */
export const TacticalGuideModal: React.FC<TacticalGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl border-2 border-[#00F0FF]/40 shadow-[0_0_40px_rgba(0,240,255,0.25)] relative overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#00F0FF]/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">ℹ️</span>
            <div>
              <h3 className="font-display font-black text-lg text-white tracking-wide">
                QUY TẮC CHIẾN THUẬT 3x3 & CƠ CHẾ COMBAT
              </h3>
              <p className="text-xs text-gray-300 font-mono">
                Cẩm nang chỉ huy Auto-Battler thời gian thực 20Hz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-white/20 bg-white/5 text-gray-400 hover:text-white hover:border-[#FF2A85] flex items-center justify-center transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-sub leading-relaxed">
          {/* 3x3 Rows */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-xs text-[#00F0FF] uppercase tracking-wider">
              1. CHIẾN THUẬT 3 HÀNG CỜ TRÊN LƯỚI 3x3
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-3 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/5">
                <span className="font-display font-bold text-xs text-[#FFD700] block mb-1">
                  🛡️ HÀNG 1: TIÊN PHONG
                </span>
                <p className="text-[11px] text-gray-300">
                  Ô 1, 2, 3: Nhận thêm <strong>+15% Nộ Mana</strong> khi bị tấn công, làm lá chắn hút hỏa lực cho toàn đội.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5">
                <span className="font-display font-bold text-xs text-[#00F0FF] block mb-1">
                  ⚡ HÀNG 2: ĐỘT KÍCH
                </span>
                <p className="text-[11px] text-gray-300">
                  Ô 4, 5, 6: Gia tăng <strong>+10% Tốc độ đánh</strong>, cơ động bọc sườn và bảo vệ vị trí trung tâm.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#FF2A85]/30 bg-[#FF2A85]/5">
                <span className="font-display font-bold text-xs text-[#FF2A85] block mb-1">
                  🎯 HÀNG 3: TRÙNG PHÁO
                </span>
                <p className="text-[11px] text-gray-300">
                  Ô 7, 8, 9: Tăng <strong>+1 Tầm bắn</strong>, xả sát thương pháo kích an toàn từ phía sau.
                </p>
              </div>
            </div>
          </div>

          {/* Cloth Damage Tiers */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="font-display font-bold text-xs text-[#FF2A85] uppercase tracking-wider">
              2. CƠ CHẾ 3 CẤP ĐỘ TỔN HẠI GIÁP (16+ TACTICAL EDITION)
            </h4>
            <div className="space-y-1.5 text-[11px] text-gray-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#00F0FF] border border-[#00F0FF]/40 bg-[#00F0FF]/10">
                  TIER 1 • PRISTINE
                </span>
                <span>Máu ≥ 70%: Giáp trụ nguyên vẹn, phòng ngự vững chắc.</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#FFD700] border border-[#FFD700]/40 bg-[#FFD700]/10">
                  TIER 2 • BATTLE-TORN
                </span>
                <span>30% ≤ Máu &lt; 70%: Giáp nứt vỡ, tốc độ tích nộ tăng vọt.</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#FF2A85] border border-[#FF2A85]/50 bg-[#FF2A85]/20 animate-pulse">
                  TIER 3 • OVERDRIVE
                </span>
                <span>Máu &lt; 30%: Quá tải năng lượng cực hạn, kích hoạt xung lực phản kích quyết tử.</span>
              </div>
            </div>
          </div>

          {/* Combat Engine */}
          <div className="space-y-1 pt-2 border-t border-white/10 text-[11px] text-gray-400">
            <p>• <strong>Server 20Hz:</strong> Mỗi giây tính toán đúng 20 tick xác định (50ms/tick).</p>
            <p>• <strong>Toán học Vector 12D:</strong> Hệ thống Buff phụ thuộc 100% vào lịch sử đối đầu của cả 2 bên.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
