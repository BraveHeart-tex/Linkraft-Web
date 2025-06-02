'use client';
import { mergeRefs } from '@/lib/objectUtils';
import { forwardRef, ReactElement } from 'react';
import useResizeObserver from 'use-resize-observer';

interface ResponsiveContainerProps {
  children: (dimensions: { width: number; height: number }) => ReactElement;
}

const containerStyles = {
  flex: 1,
  width: '100%',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
};

export const ResponsiveContainer = forwardRef(
  (props: ResponsiveContainerProps, forwardRef) => {
    const { ref, width, height } = useResizeObserver();
    return (
      <div style={containerStyles} ref={mergeRefs(ref, forwardRef)}>
        {width && height ? props.children({ width, height }) : null}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';
