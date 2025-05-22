'use client';
import { Button } from '@/components/ui/Button';
import { useSelection } from '@/context/SelectionContext';
import { CheckSquare } from 'lucide-react';

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
        <CheckSquare />
      </Button>
    </div>
  );
};
export default SelectionControls;
