import { CSSProperties } from 'react';

interface CollectionDragLineProps {
  draglineStyle: CSSProperties;
}

const CollectionDragLine = ({ draglineStyle }: CollectionDragLineProps) => {
  return (
    <div
      style={draglineStyle}
      className="absolute h-[2px] mt-[-1px] w-full bg-primary"
    >
      <div className="absolute -left-[1px] -top-[1px] h-[4px] w-[4px] rounded-full border-[2px] border-primary bg-white" />
    </div>
  );
};

export default CollectionDragLine;
