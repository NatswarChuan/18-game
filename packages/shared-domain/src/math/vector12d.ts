import { EPSILON, VECTOR_DIMENSIONS } from '../constants/index.js';

/**
 * Type-safe 12-dimensional vector.
 * Kiểu vector 12 chiều an toàn kiểu dữ liệu.
 */
export type Vector12D = readonly [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];

/**
 * Zero vector for 12 dimensions.
 * Vector 0 cho không gian 12 chiều.
 */
export const ZERO_VECTOR_12D: Vector12D = [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
];

/**
 * Calculates dot product between two 12D vectors.
 * Tính tích vô hướng giữa hai vector 12 chiều.
 *
 * @param a - First vector 12D / Vector thứ nhất
 * @param b - Second vector 12D / Vector thứ hai
 * @returns The scalar dot product / Giá trị vô hướng
 */
export function dotProduct12D(a: Vector12D, b: Vector12D): number {
  let sum = 0;
  for (let i = 0; i < VECTOR_DIMENSIONS; i += 1) {
    const valA = a[i] ?? 0;
    const valB = b[i] ?? 0;
    sum += valA * valB;
  }
  return sum;
}

/**
 * Calculates Euclidean magnitude (L2 norm) of a 12D vector.
 * Tính độ dài Euclidean (chuẩn L2) của vector 12 chiều.
 *
 * @param v - Input vector 12D / Vector đầu vào
 * @returns Magnitude length / Độ dài vector
 */
export function magnitude12D(v: Vector12D): number {
  return Math.sqrt(dotProduct12D(v, v));
}

/**
 * Calculates Cosine Similarity between two 12D vectors with Epsilon division guard.
 * Tính độ tương đồng Cosine giữa 2 vector 12 chiều có bảo vệ chia cho 0.
 *
 * @param a - First vector / Vector thứ nhất
 * @param b - Second vector / Vector thứ hai
 * @returns Cosine similarity bounded in [-1.0, 1.0] / Độ tương đồng trong khoảng [-1.0, 1.0]
 */
export function cosineSimilarity12D(a: Vector12D, b: Vector12D): number {
  const magA = magnitude12D(a);
  const magB = magnitude12D(b);
  const denominator = magA * magB;

  if (denominator < EPSILON) {
    return 0;
  }

  const rawCosine = dotProduct12D(a, b) / denominator;
  return Math.max(-1.0, Math.min(1.0, rawCosine));
}

/**
 * Normalizes a 12D vector to unit length (L2 norm = 1).
 * Chuẩn hóa vector 12 chiều về độ dài đơn vị.
 *
 * @param v - Input vector / Vector đầu vào
 * @returns Normalized 12D vector / Vector 12 chiều chuẩn hóa
 */
export function normalize12D(v: Vector12D): Vector12D {
  const mag = magnitude12D(v);
  if (mag < EPSILON) {
    return ZERO_VECTOR_12D;
  }

  const result: number[] = [];
  for (let i = 0; i < VECTOR_DIMENSIONS; i += 1) {
    const component = v[i] ?? 0;
    result.push(component / mag);
  }

  return result as unknown as Vector12D;
}

/**
 * Computes counter-alignment score using anti-correlation weights.
 * Tính điểm khắc chế dựa trên sự bù trừ đối kháng các chiều tương ứng.
 *
 * @param playerVec - Player accumulated vector / Vector tích lũy của người chơi
 * @param candidateBuffVec - Candidate buff vector / Vector buff ứng viên
 * @returns Counter score / Điểm khắc chế
 */
export function calculateCounterScore12D(playerVec: Vector12D, candidateBuffVec: Vector12D): number {
  // Physical damage (0) countered by Physical Armor (3)
  // Energy damage (1) countered by Energy Shield (4)
  // Attack Speed (6) countered by Crowd Control (9)
  // Critical (7) countered by Counter Reflect (11)
  const directSim = cosineSimilarity12D(playerVec, candidateBuffVec);
  return -directSim;
}
