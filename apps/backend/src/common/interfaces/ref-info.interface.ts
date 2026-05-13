/**
 * Thông tin tham chiếu gọn: id + tên hiển thị.
 * Dùng chung cho operator, pickup, dropoff, hub, route stop…
 * Frontend dễ dàng truyền làm props cho component con.
 */
export interface RefInfo {
  readonly id: string;
  readonly name: string;
}

export interface BusInfo {
  readonly id: string;
  readonly type: string;
  readonly number: string;
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Trích id string từ populated document hoặc ObjectId.
 *
 *   populated → { _id: ObjectId('...'), name: '...' } → '...'
 *   ObjectId  → ObjectId('...')                        → '...'
 *   string    → '...'                                  → '...'
 */
export function resolveId(ref: unknown): string {
  if (!ref) return '';
  if (typeof ref === 'object' && ref !== null && '_id' in ref) {
    return String(ref._id);
  }
  // ref ở đây là ObjectId hoặc string — cả hai đều có toString() hợp lệ
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object' && ref !== null && 'toHexString' in ref) {
    return (ref as { toHexString(): string }).toHexString();
  }
  return '';
}

/**
 * Trích name từ populated document. Trả '' nếu chưa populate.
 */
export function resolveName(ref: unknown): string {
  if (typeof ref === 'object' && ref !== null && 'name' in ref) {
    return String(ref.name);
  }
  return '';
}

/**
 * Trích field bất kỳ từ populated document.
 */
export function resolveField<T = string>(
  ref: unknown,
  field: string,
): T | undefined {
  if (typeof ref === 'object' && ref !== null && field in ref) {
    return (ref as Record<string, unknown>)[field] as T;
  }
  return undefined;
}
