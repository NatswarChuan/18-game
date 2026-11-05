import { FreyjaHierarchy } from './freyja-geometry.js';
import { UnitCombatVisualState } from '../valkyrie-3d-types.js';

export interface FreyjaAnimationState {
  attackTime: number;
  ultimateTime: number;
  hitTime: number;
}

/**
 * Controller for Freyja's lifelike anime breathing, sword combat, and ultimate animations.
 * Bộ điều khiển hoạt ảnh nhịp thở anime, chém đại kiếm và giáng lôi tuyệt kỹ của Freyja.
 */
export class FreyjaAnimationController {
  private readonly hierarchy: FreyjaHierarchy;
  private readonly animState: FreyjaAnimationState = {
    attackTime: 0,
    ultimateTime: 0,
    hitTime: 0
  };

  public constructor(hierarchy: FreyjaHierarchy) {
    this.hierarchy = hierarchy;
  }

  public triggerAttack(): void {
    this.animState.attackTime = 0.65;
  }

  public triggerUltimate(): void {
    this.animState.ultimateTime = 1.2;
  }

  public triggerHit(): void {
    this.animState.hitTime = 0.3;
  }

  /**
   * Updates all joint rotations, chest breathing, and weapon poses per frame.
   * Cập nhật chuyển động khớp, nhịp thở lồng ngực và tư thế vũ khí mỗi khung hình.
   */
  public update(delta: number, elapsedTime: number, state: UnitCombatVisualState): void {
    const {
      chestGroup,
      spineGroup,
      hipsGroup,
      headGroup,
      ponytail,
      leftArmGroup,
      rightArmGroup,
      leftForearmGroup,
      rightForearmGroup,
      leftLegGroup,
      rightLegGroup,
      greatswordGroup,
      breastLeft,
      breastRight,
      breastplateGroup
    } = this.hierarchy;

    // 1. Idle Breathing and Subtle Weight Shift (Sensual Respiration)
    // Panting speeds up under battle stress (Tier 2/3)
    const tierMultiplier = state.tier === 3 ? 1.6 : (state.tier === 2 ? 1.3 : 1.0);
    const breathRate = 1.9 * tierMultiplier;
    const breathPhase = Math.sin(elapsedTime * breathRate);
    const swayPhase = Math.cos(elapsedTime * 1.1);
    const microJiggle = Math.sin(elapsedTime * breathRate * 2.0) * (0.005 * tierMultiplier);

    // Sensual chest & bust breathing expansion and natural gravitational softness
    chestGroup.position.y = 0.20 + breathPhase * 0.012;
    const breastBreath = 1.0 + breathPhase * (0.020 * tierMultiplier);
    const baseBustY = 0.032;
    const breastBobY = baseBustY + (breathPhase * 0.004 + microJiggle * 0.4) * tierMultiplier;

    breastLeft.scale.set(breastBreath, breastBreath, breastBreath);
    breastRight.scale.set(breastBreath, breastBreath, breastBreath);
    breastLeft.position.y = breastBobY;
    breastRight.position.y = breastBobY;

    if (breastplateGroup) {
      breastplateGroup.scale.set(breastBreath, breastBreath, 1.0 + breathPhase * 0.015);
      breastplateGroup.position.y = (breastBobY - baseBustY) * 0.8;
    }

    // 2. Alluring Anime S-Curve Contrapposto Idle Pose:
    // Hips: Weight shifted firmly onto left leg; pelvis tilted upwards on the left side
    const hipTiltZ = -0.062 + swayPhase * 0.012;
    const hipSwayX = 0.024 + swayPhase * 0.006;
    const hipTurnY = 0.080 + Math.sin(elapsedTime * 0.8) * 0.015;
    hipsGroup.position.x = hipSwayX;
    hipsGroup.rotation.z = hipTiltZ;
    hipsGroup.rotation.y = hipTurnY;

    // Legs: Supporting straight left leg vs alluring bent-knee right leg (uchimata)
    // Left Leg (Supporting column):
    leftLegGroup.position.set(-0.062, 0, -0.010);
    leftLegGroup.rotation.z = 0.052 - swayPhase * 0.010; // Compensates hip tilt to stay grounded
    leftLegGroup.rotation.y = 0.045;
    leftLegGroup.rotation.x = -0.015;

    // Right Leg (Relaxed, knee turned slightly inward, inner thighs soft touch - classic sexy anime stance):
    rightLegGroup.position.set(0.058, 0, 0.030);
    rightLegGroup.rotation.z = -0.046;
    rightLegGroup.rotation.x = 0.120 + breathPhase * 0.012; // Slight knee bend forward
    rightLegGroup.rotation.y = -0.085; // Inward turn (uchimata)

    // Spine & Waist: Counter-curves the pelvis tilt, arches back to accentuate bust and hips
    spineGroup.position.x = -0.012;
    spineGroup.rotation.z = 0.065 - swayPhase * 0.010; // S-Curve waist bend
    spineGroup.rotation.x = -0.075; // Arched lumbar spine (pushes bust forward, derriere rearward)
    spineGroup.rotation.y = -0.060 + swayPhase * 0.025;

    // Chest & Shoulders: Proud, upright, chest pushed forward
    chestGroup.rotation.x = -0.045;
    chestGroup.rotation.z = -0.018;

    // Head: Seductive tilted gaze toward the player / viewer (bedroom eyes)
    headGroup.rotation.x = 0.045 + breathPhase * 0.010;
    headGroup.rotation.y = -0.075 - swayPhase * 0.020;
    headGroup.rotation.z = -0.035;

    // Hair physics: Silky ponytail and strands swaying softly
    ponytail.rotation.z = Math.sin(elapsedTime * 2.2) * 0.14 + swayPhase * 0.05;
    ponytail.rotation.x = -0.28 + breathPhase * 0.06;

    // 3. Left Arm: Hand rests elegantly on the flared hip with natural elbow bend
    let leftUpperRotX = -0.12;
    let leftUpperRotY = 0.14;
    let leftUpperRotZ = 0.26 + breathPhase * 0.008;
    let leftForearmRotX = -0.48; // Natural elbow bend inward!
    let leftForearmRotY = 0.22;
    let leftForearmRotZ = -0.16;

    // 4. Right Arm: Holding Greatsword planted firmly in ready stance
    let rightUpperRotX = 0.05;
    let rightUpperRotY = -0.08;
    let rightUpperRotZ = -0.14;
    let rightForearmRotX = -0.24; // Elbow angled gently holding sword
    let rightForearmRotY = -0.10;
    let rightForearmRotZ = 0.08;
    let swordTargetRotX = Math.PI - 0.45;
    let swordTargetRotZ = -0.18;
    let rootOffsetY = 0;

    // 5. Attack Animation Sequence (0.65s duration)
    if (this.animState.attackTime > 0) {
      this.animState.attackTime -= delta;
      const progress = Math.max(0, 1 - this.animState.attackTime / 0.65);

      if (progress < 0.3) {
        // Wind-up: Pull sword back
        const t = progress / 0.3;
        rightUpperRotX = 0.05 + t * 1.1;
        rightUpperRotZ = -0.14 + t * 0.4;
        rightForearmRotX = -0.24 - t * 0.3;
        swordTargetRotX = (Math.PI - 0.45) * (1 - t) + (-0.85) * t;
        spineGroup.rotation.y = -t * 0.35;
      } else if (progress < 0.65) {
        // Cleave: Massive forward slash arc
        const t = (progress - 0.3) / 0.35;
        rightUpperRotX = 1.15 - t * 1.4;
        rightUpperRotZ = 0.26 - t * 0.6;
        rightForearmRotX = -0.54 + t * 0.4;
        swordTargetRotX = -1.35 + t * 2.2;
        spineGroup.rotation.y = -0.35 + t * 0.7;
        leftUpperRotX = -0.12 - t * 0.45;
      } else {
        // Recovery back to idle
        const t = (progress - 0.65) / 0.35;
        rightUpperRotX = -0.25 * (1 - t) + 0.05 * t;
        swordTargetRotX = 0.85 * (1 - t) + (Math.PI - 0.45) * t;
        leftUpperRotX = -0.57 * (1 - t) + (-0.12) * t;
      }
    }

    // 6. Ultimate Climax Plunge Animation (1.2s duration)
    if (this.animState.ultimateTime > 0 || state.isCasting) {
      if (this.animState.ultimateTime > 0) this.animState.ultimateTime -= delta;
      const progress = Math.max(0, 1 - this.animState.ultimateTime / 1.2);

      if (progress < 0.45) {
        // Leap into the air
        const t = progress / 0.45;
        rootOffsetY = Math.sin(t * Math.PI * 0.5) * 0.85;
        rightUpperRotX = 1.5;
        rightForearmRotX = -0.5;
        swordTargetRotX = -1.5;
        leftUpperRotX = 1.1;
      } else if (progress < 0.75) {
        // Downward slam
        const t = (progress - 0.45) / 0.3;
        rootOffsetY = 0.85 * (1 - t);
        rightUpperRotX = 1.5 - t * 1.9;
        rightForearmRotX = -0.5 + t * 0.3;
        swordTargetRotX = -1.5 + t * 2.5;
        leftUpperRotX = 0.3;
      } else {
        // Impact pose
        rootOffsetY = 0;
        rightUpperRotX = -0.4;
        swordTargetRotX = 1.0;
      }
    }

    // 7. Hit Reaction / Damage Flinch (0.3s duration)
    if (this.animState.hitTime > 0) {
      this.animState.hitTime -= delta;
      const t = this.animState.hitTime / 0.3;
      spineGroup.position.z = -t * 0.08;
      headGroup.rotation.x = -t * 0.25;
      chestGroup.rotation.x = -t * 0.15;
    }

    // Apply computed weapon & arm rotations
    leftArmGroup.rotation.x = leftUpperRotX;
    leftArmGroup.rotation.y = leftUpperRotY;
    leftArmGroup.rotation.z = leftUpperRotZ;
    if (leftForearmGroup) {
      leftForearmGroup.rotation.x = leftForearmRotX;
      leftForearmGroup.rotation.y = leftForearmRotY;
      leftForearmGroup.rotation.z = leftForearmRotZ;
    }

    rightArmGroup.rotation.x = rightUpperRotX;
    rightArmGroup.rotation.y = rightUpperRotY;
    rightArmGroup.rotation.z = rightUpperRotZ;
    if (rightForearmGroup) {
      rightForearmGroup.rotation.x = rightForearmRotX;
      rightForearmGroup.rotation.y = rightForearmRotY;
      rightForearmGroup.rotation.z = rightForearmRotZ;
    }

    greatswordGroup.rotation.x = swordTargetRotX;
    greatswordGroup.rotation.z = swordTargetRotZ;
    this.hierarchy.rootGroup.position.y = rootOffsetY;
  }
}
