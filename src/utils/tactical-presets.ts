import { UnitPlacement } from '../types.js';

export type TacticalPresetType = 'VANGUARD' | 'FLANK' | 'BUNKER';

export const TACTICAL_PRESETS: Readonly<Record<TacticalPresetType, readonly UnitPlacement[]>> = {
  VANGUARD: [
    { valkyrieId: 'VALK-01', slotIndex: 1 }, // Freyja (Front Center)
    { valkyrieId: 'VALK-02', slotIndex: 0 }, // Brynhildr (Front Left)
    { valkyrieId: 'VALK-07', slotIndex: 2 }, // Herja (Front Right)
    { valkyrieId: 'VALK-03', slotIndex: 4 }, // Sigrun (Mid Center)
    { valkyrieId: 'VALK-06', slotIndex: 7 }, // Mist (Back Center)
    { valkyrieId: 'VALK-09', slotIndex: 8 }, // Gondul (Back Right)
  ],
  FLANK: [
    { valkyrieId: 'VALK-03', slotIndex: 3 }, // Sigrun (Mid Left)
    { valkyrieId: 'VALK-01', slotIndex: 1 }, // Freyja (Front Center)
    { valkyrieId: 'VALK-04', slotIndex: 5 }, // Kara (Mid Right)
    { valkyrieId: 'VALK-07', slotIndex: 2 }, // Herja (Front Right)
    { valkyrieId: 'VALK-06', slotIndex: 6 }, // Mist (Back Left)
    { valkyrieId: 'VALK-08', slotIndex: 8 }, // Rota (Back Right)
  ],
  BUNKER: [
    { valkyrieId: 'VALK-02', slotIndex: 1 }, // Brynhildr (Front Center)
    { valkyrieId: 'VALK-04', slotIndex: 0 }, // Kara (Front Left)
    { valkyrieId: 'VALK-05', slotIndex: 4 }, // Alvitr (Mid Center)
    { valkyrieId: 'VALK-06', slotIndex: 7 }, // Mist (Back Center)
    { valkyrieId: 'VALK-08', slotIndex: 6 }, // Rota (Back Left)
    { valkyrieId: 'VALK-09', slotIndex: 8 }, // Gondul (Back Right)
  ],
};
