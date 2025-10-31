import { nanoid, customAlphabet } from 'nanoid';

/**
 * Generates a unique room code (uppercase alphanumeric, 6 characters)
 * Example: "ABC123", "XYZ789"
 */
export function generateRoomCode(): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const generateCode = customAlphabet(alphabet, 6);
  return generateCode();
}

/**
 * Generates a unique player ID
 */
export function generatePlayerId(): string {
  return nanoid();
}

/**
 * Generates a unique room ID
 */
export function generateRoomId(): string {
  return nanoid();
}
