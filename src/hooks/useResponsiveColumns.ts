import { useEffect, useState } from 'react';

const breakpoints = [
  { minWidth: 1280, columns: 3 }, // xl
  { minWidth: 768, columns: 2 }, // md
  { minWidth: 0, columns: 1 }, // base
];

const getColumns = (width: number): number => {
  for (const bp of breakpoints) {
    if (width >= bp.minWidth) {
      return bp.columns;
    }
  }
  return 1;
};

export const useResponsiveColumns = (): number => {
  const [columns, setColumns] = useState<number>(() =>
    typeof window !== 'undefined' ? getColumns(window.innerWidth) : 1
  );

  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(columns);

  return columns;
};
