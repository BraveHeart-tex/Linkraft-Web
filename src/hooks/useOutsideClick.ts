import { useEffect, useRef } from 'react';

type RefElement = HTMLElement | null;
type Handler = (event: MouseEvent | TouchEvent) => void;

export const useOutsideClick = (
  refs: React.RefObject<RefElement> | React.RefObject<RefElement>[],
  handler: Handler
) => {
  const handlerRef = useRef(handler);

  // Always latest handler without re-attaching listeners
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];
      const isInside = refArray.some((ref) => {
        const el = ref.current;
        return el && el.contains(event.target as Node);
      });

      if (!isInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs]);
};
