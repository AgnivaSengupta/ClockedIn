import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

const { createIdentityMatrix, multiplyInto } = MatrixMath;

type Matrix4x4 = number[]; // 4x4 matrix (16 elements)
type Origin = {
  x: number;
  y: number;
  z: number;
};

/**
 * Rotate matrix around X-axis by degrees.
 */
function rotateXMatrix(matrix: Matrix4x4, deg: number): void {
  const rad = (Math.PI / 180) * deg;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rotate: Matrix4x4 = [
    1, 0, 0, 0,
    0, cos, -sin, 0,
    0, sin, cos, 0,
    0, 0, 0, 1,
  ];
  multiplyInto(matrix, matrix, rotate);
}

/**
 * Add perspective to matrix.
 */
function perspectiveMatrix(matrix: Matrix4x4, value: number): void {
  const perspective = createIdentityMatrix();
  MatrixMath.reusePerspectiveCommand(perspective, value);
  multiplyInto(matrix, matrix, perspective);
}

/**
 * Translate matrix by given origin.
 */
function translateMatrix(matrix: Matrix4x4, origin: Origin): void {
  const { x, y, z } = origin;
  const translate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  multiplyInto(matrix, translate, matrix);
}

/**
 * Un-translate matrix (inverse of translate).
 */
function untranslateMatrix(matrix: Matrix4x4, origin: Origin): void {
  const { x, y, z } = origin;
  const unTranslate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(unTranslate, -x, -y, -z);
  multiplyInto(matrix, matrix, unTranslate);
}

/**
 * Format time as two-digit strings.
 */
function formatTime(hours: number, minutes: number, seconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const h = hours < 10 ? `0${hours}` : `${hours}`;
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return { hours: h, minutes: m, seconds: s };
}

/**
 * Convert seconds to { hours, minutes, seconds }.
 */
function formatNumberToTime(number: string | number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const secNum = parseInt(number.toString(), 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - (hours * 3600)) / 60);
  const seconds = secNum - (hours * 3600) - (minutes * 60);
  return formatTime(hours, minutes, seconds);
}

/**
 * Add 1 second to time and return updated formatted values.
 */
function addTime(
  hours: string | number,
  minutes: string | number,
  seconds: string | number
): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  let h = parseInt(hours.toString(), 10);
  let m = parseInt(minutes.toString(), 10);
  let s = parseInt(seconds.toString(), 10);

  s += 1;
  if (s >= 60) {
    const extraMinutes = Math.floor(s / 60);
    m += extraMinutes;
    s -= 60 * extraMinutes;
  }

  if (m >= 60) {
    const extraHours = Math.floor(m / 60);
    h += extraHours;
    m -= 60 * extraHours;
  }

  return formatTime(h, m, s);
}

export default {
  createIdentityMatrix,
  multiplyInto,
  rotateXMatrix,
  perspectiveMatrix,
  translateMatrix,
  untranslateMatrix,
  formatNumberToTime,
  addTime,
};
