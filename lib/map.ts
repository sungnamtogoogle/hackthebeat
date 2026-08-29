/**
 * 도면 격자 상수. 캔버스(1200x720)를 40px 격자로 나누고,
 * 테두리 안쪽 셀 범위(GRID)에만 블록을 둘 수 있다.
 */
export const CELL = 40;
export const VIEW_W = 1200;
export const VIEW_H = 720;
export const GRID = { minX: 1, maxX: 28, minY: 1, maxY: 16 } as const;

/**
 * 에디터가 도면을 임시 저장하는 브라우저 저장소 키.
 * TODO(미정): 스키마 확정 후 events.blocks(jsonb) 서버 저장으로 바꾼다.
 */
export const blocksStorageKey = (eventId: string) => `nemo-blocks:${eventId}`;
