import { useEffect } from 'react';

interface ShortcutOptions {
  /**
   * Optional: Limit shortcut to a specific DOM element or modal ref.
   */
  target?: HTMLElement | null;
  /**
   * Avoid triggering inside inputs, textareas, or contenteditables.
   */
  ignoreFormFields?: boolean;
  /**
   * Whether the shortcut is active.
   */
  enabled?: boolean;
  /**
   * If true, prevents default browser behavior (e.g., Ctrl+S).
   */
  preventDefault?: boolean;
}

interface ShortcutCombo {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

/**
 * Normalize key combo matching
 */
function matchShortcut(e: KeyboardEvent, combo: ShortcutCombo) {
  return (
    e.key.toLowerCase() === combo.key.toLowerCase() &&
    !!combo.ctrl === e.ctrlKey &&
    !!combo.shift === e.shiftKey &&
    !!combo.alt === e.altKey &&
    !!combo.meta === e.metaKey
  );
}

export function useKeyboardShortcut(
  combo: ShortcutCombo,
  callback: (e: KeyboardEvent) => void,
  options?: ShortcutOptions
) {
  const {
    enabled = true,
    ignoreFormFields = true,
    preventDefault = true,
    target = null,
  } = options || {};

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: Event) => {
      if (!(e instanceof KeyboardEvent)) return;

      const el = e.target as HTMLElement;

      if (
        ignoreFormFields &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.isContentEditable)
      ) {
        return;
      }

      if (matchShortcut(e, combo)) {
        if (preventDefault) e.preventDefault();
        callback(e);
      }
    };

    const bindTarget = target || window;
    bindTarget.addEventListener('keydown', handler);
    return () => bindTarget.removeEventListener('keydown', handler);
  }, [
    enabled,
    combo.key,
    combo.ctrl,
    combo.shift,
    combo.alt,
    combo.meta,
    callback,
    target,
    ignoreFormFields,
    combo,
    preventDefault,
  ]);
}
