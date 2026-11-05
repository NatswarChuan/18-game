import { Valkyrie3DModelInstance, ValkyrieModelInitConfig } from './valkyrie-3d-types.js';
import { createFreyja3DModel } from './valk-01-freyja/index.js';
import { createBrynhildr3DModel } from './valk-02-brynhildr/index.js';
import { createSigrun3DModel } from './valk-03-sigrun/index.js';
import { createKara3DModel } from './valk-04-kara/index.js';
import { createAlvitr3DModel } from './valk-05-alvitr/index.js';
import { createMistModel } from './valk-06-mist/index.js';
import { createHerjaModel } from './valk-07-herja/index.js';
import { createRotaModel } from './valk-08-rota/index.js';
import { createGondulModel } from './valk-09-gondul/index.js';
import { createGenericHumanoid3DModel } from './generic-humanoid-fallback.js';

export type ValkyrieModelFactory = (config: ValkyrieModelInitConfig) => Valkyrie3DModelInstance;

/**
 * Registry of individually engineered, bespoke 3D anime humanoid Valkyrie models.
 * Bảng đăng ký các mô hình 3D hình người riêng biệt cho từng Valkyrie được thiết kế tuần tự.
 */
const VALKYRIE_3D_REGISTRY: Readonly<Record<string, ValkyrieModelFactory>> = {
  'VALK-01': createFreyja3DModel,
  'VALK-02': createBrynhildr3DModel,
  'VALK-03': createSigrun3DModel,
  'VALK-04': createKara3DModel,
  'VALK-05': createAlvitr3DModel,
  'VALK-06': createMistModel,
  'VALK-07': createHerjaModel,
  'VALK-08': createRotaModel,
  'VALK-09': createGondulModel
  // Step-by-step subsequent models will be registered here (VALK-10 through VALK-27)
};

/**
 * Instantiates the true 3D procedural humanoid model for the given Valkyrie.
 * Khởi tạo mô hình 3D hình người thực tế cho nữ chiến binh Valkyrie tương ứng (100% không dùng ảnh 2D).
 *
 * @param config - Model initialization configuration.
 * @returns Instantiated Valkyrie3DModelInstance.
 */
export function createValkyrie3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const factory = VALKYRIE_3D_REGISTRY[config.valkyrieId];
  if (factory) {
    return factory(config);
  }
  return createGenericHumanoid3DModel(config);
}
