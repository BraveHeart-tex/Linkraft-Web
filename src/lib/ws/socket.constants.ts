export const SOCKET_EVENTS = {
  BOOKMARK: {
    SUBSCRIBE: 'bookmark:subscribe',
    UNSUBSCRIBE: 'bookmark:unsubscribe',
    UPDATE: 'bookmark:update',
  },
  IMPORT: {
    SUBSCRIBE: 'import:subscribe',
    UNSUBSCRIBE: 'import:unsubscribe',
    PROGRESS: 'import:progress',
    COMPLETE: 'import:complete',
    ERROR: 'import:error',
  },
} as const;
export const SOCKET_NAMESPACES = {
  BOOKMARKS: 'bookmarks',
};
