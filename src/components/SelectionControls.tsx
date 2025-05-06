'use client';
import { Button } from '@/components/ui/button';
import { useSelection } from '@/context/SelectionContext';
import { PencilIcon } from 'lucide-react';

const SelectionControls = () => {
  const { dispatch, state } = useSelection();

  const handleToggleSelectMode = () => {
    dispatch({ type: 'TOGGLE_SELECT_MODE' });
  };

  return (
    <div>
      <Button
        variant={state.isSelectMode ? 'secondary' : 'ghost'}
        onClick={handleToggleSelectMode}
      >
        <PencilIcon />
      </Button>
    </div>
  );
};
export default SelectionControls;
