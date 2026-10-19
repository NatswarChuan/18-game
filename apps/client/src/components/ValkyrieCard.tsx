import React, { useState, useEffect, useRef } from 'react';
import { CombatEntitySnapshot, getValkyrieById } from '@valkyrie/shared-domain';

interface ValkyrieCardProps {
  readonly entity?: CombatEntitySnapshot | undefined;
  readonly valkyrieId: string;
  readonly isEnemy?: boolean | undefined;
  readonly onInspect?: ((valkyrieId: string) => void) | undefined;
  readonly compact?: boolean | undefined;
}

export const ValkyrieCard: React.FC<ValkyrieCardProps> = ({
  entity,
  valkyrieId,
  isEnemy = false,
  onInspect,
  compact = false
}) => {
  const valk = getValkyrieById(valkyrieId);
  if (!valk) return null;

  const hp = entity ? entity.currentHp : valk.stats.maxHp;
  const maxHp = valk.stats.maxHp;
  const hpPercent = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));

  const mana = entity ? entity.currentMana : 0;
  const maxMana = 100;
  const manaPercent = Math.max(0, Math.min(100, Math.round((mana / maxMana) * 100)));

  const tier = entity ? entity.clothDamageTier : 1;
  const isCasting = entity?.isCastingUltimate ?? false;
  const isDead = entity ? !entity.isAlive : false;

  // Floating Combat Numbers
  const prevHpRef = useRef(hp);
  const [damageFloater, setDamageFloater] = useState<{ value: number; type: 'DAMAGE' | 'HEAL'; id: number } | null>(null);

  useEffect(() => {
    if (entity) {
      const diff = entity.currentHp - prevHpRef.current;
      if (diff < 0) {
        setDamageFloater({ value: Math.abs(diff), type: 'DAMAGE', id: Date.now() });
      } else if (diff > 0) {
        setDamageFloater({ value: diff, type: 'HEAL', id: Date.now() });
      }
      prevHpRef.current = entity.currentHp;
    }
  }, [entity?.currentHp]);

  useEffect(() => {
    if (!damageFloater) return;
    const timer = setTimeout(() => {
      setDamageFloater(null);
    }, 850);
    return () => clearTimeout(timer);
  }, [damageFloater?.id]);

  // Tier border and glow
  let tierBadge = 'TIER 1 • PRISTINE';
  let tierColor = 'text-[#00F0FF] border-[#00F0FF]/40 bg-[#00F0FF]/10';
  let cardBorder = 'border-[#00F0FF]/30';

  if (tier === 2) {
    tierBadge = 'TIER 2 • BATTLE-TORN';
    tierColor = 'text-[#FFD700] border-[#FFD700]/40 bg-[#FFD700]/10';
    cardBorder = 'border-[#FFD700]/50 shadow-[0_0_12px_rgba(255,215,0,0.2)]';
  } else if (tier === 3) {
    tierBadge = 'TIER 3 • OVERDRIVE';
    tierColor = 'text-[#FF2A85] border-[#FF2A85]/50 bg-[#FF2A85]/20 animate-pulse';
    cardBorder = 'border-[#FF2A85] critical-burst-pulse';
  }

  // Compact Mode: Optimized for in-grid battle token
  if (compact) {
    return (
      <div
        className={`relative w-full h-full p-1.5 rounded-lg border glass-panel transition-all duration-200 flex flex-col justify-between ${cardBorder} ${
          isDead ? 'opacity-30 grayscale' : ''
        } ${isCasting ? 'scale-105 shadow-[0_0_20px_#FF2A85] border-[#FF2A85]' : ''}`}
      >
        {/* Floating Damage Text */}
        {damageFloater && (
          <div
            key={damageFloater.id}
            className={`absolute -top-3 right-1 pointer-events-none font-display font-black text-xs z-30 floating-damage ${
              damageFloater.type === 'DAMAGE'
                ? 'text-[#FF3344] drop-shadow-[0_0_8px_rgba(255,51,68,0.9)]'
                : 'text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.9)]'
            }`}
          >
            {damageFloater.type === 'DAMAGE' ? `-${damageFloater.value}` : `+${damageFloater.value}`}
          </div>
        )}

        {/* Top: Avatar + Name + Tier Badge */}
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-gradient-to-tr from-[#FF2A85] to-[#8A2BE2] flex-shrink-0 relative shadow-sm">
            <img
              src={`/avatars/${valk.id}.jpg`}
              alt={valk.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-white">
              {valk.name[0]}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h5 className="font-display font-bold text-[11px] text-white truncate leading-tight">
                {valk.name}
              </h5>
              {onInspect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(valk.id);
                  }}
                  className="w-3.5 h-3.5 rounded bg-white/10 hover:bg-[#00F0FF]/30 text-[9px] text-gray-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                  title="Chi tiết"
                >
                  ℹ
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`px-1 py-0.1 rounded text-[8px] font-mono font-bold border ${tierColor}`}>
                {tier === 1 ? 'T1' : tier === 2 ? 'T2 TORN' : 'T3 BURST'}
              </span>
              {isEnemy && <span className="text-[8px] text-red-400 font-mono font-bold">[FOE]</span>}
            </div>
          </div>
        </div>

        {/* Bottom: Mini HP & Mana Bars */}
        <div className="space-y-1 mt-1">
          {/* Mini HP */}
          <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                hpPercent > 50 ? 'bg-[#00F0FF]' : hpPercent > 25 ? 'bg-[#FFD700]' : 'bg-[#FF3344]'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          {/* Mini Mana */}
          <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                mana >= 100 ? 'bg-[#FF2A85] animate-pulse' : 'bg-[#8A2BE2]'
              }`}
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-3 rounded-xl border glass-panel transition-all duration-300 ${cardBorder} ${
        isDead ? 'opacity-40 grayscale' : ''
      } ${isCasting ? 'scale-105 shadow-[0_0_25px_#FF2A85]' : ''}`}
      style={{ minWidth: '180px' }}
    >
      {/* Floating Combat Text */}
      {damageFloater && (
        <div
          key={damageFloater.id}
          className={`absolute -top-3 right-3 pointer-events-none font-display font-black text-sm z-30 floating-damage ${
            damageFloater.type === 'DAMAGE'
              ? 'text-[#FF3344] drop-shadow-[0_0_8px_rgba(255,51,68,0.9)]'
              : 'text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.9)]'
          }`}
        >
          {damageFloater.type === 'DAMAGE' ? `-${damageFloater.value}` : `+${damageFloater.value}`}
        </div>
      )}

      {/* Faction Header & Inspect Button */}
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-mono text-[10px] text-gray-400">
          {valk.faction.replace('_', ' ')}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${tierColor}`}>
            {tierBadge}
          </span>
          {onInspect && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInspect(valk.id);
              }}
              className="w-4 h-4 rounded-full bg-white/10 hover:bg-[#00F0FF]/30 text-[10px] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              title="Xem chi tiết Valkyrie"
            >
              ℹ
            </button>
          )}
        </div>
      </div>

      {/* Valkyrie Name & Role & Avatar */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-gradient-to-tr from-[#FF2A85] to-[#8A2BE2] flex-shrink-0 relative shadow-md">
            <img
              src={`/avatars/${valk.id}.jpg`}
              alt={valk.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Graceful fallback to letter badge if avatar file doesn't exist
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white -z-0">
              {valk.name[0]}
            </span>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5 leading-tight">
              {valk.name}
              {isEnemy && <span className="text-[10px] text-red-400 font-mono">[FOE]</span>}
            </h4>
            <p className="text-[11px] text-gray-300 leading-tight">{valk.title}</p>
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-1.5">
        <div className="flex justify-between text-[10px] font-mono mb-0.5">
          <span className="text-gray-400">HP</span>
          <span className="text-gray-200">{hp} / {maxHp}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              hpPercent > 50 ? 'bg-[#00F0FF]' : hpPercent > 25 ? 'bg-[#FFD700]' : 'bg-[#FF3344]'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Mana Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-[10px] font-mono mb-0.5">
          <span className="text-gray-400">MANA</span>
          <span className="text-[#8A2BE2]">{mana} / {maxMana}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#FF2A85] transition-all duration-150"
            style={{ width: `${manaPercent}%` }}
          />
        </div>
      </div>

      {/* Battle Damage Description */}
      <div className="text-[10px] text-gray-400 italic line-clamp-2 min-h-[28px] border-t border-white/5 pt-1">
        {tier === 1 && valk.battleDamage.tier1Description}
        {tier === 2 && valk.battleDamage.tier2Description}
        {tier === 3 && valk.battleDamage.tier3Description}
      </div>

      {/* Casting Ultimate Banner */}
      {isCasting && (
        <div className="absolute inset-0 bg-[#FF2A85]/40 rounded-xl flex items-center justify-center backdrop-blur-sm animate-pulse">
          <span className="font-display font-black text-xs text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            ⚡ {valk.ultimate.name}!
          </span>
        </div>
      )}
    </div>
  );
};
