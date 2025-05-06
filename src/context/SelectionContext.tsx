'use client';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { createContext, useContext, useReducer } from 'react';

type SelectionState = {
  selectedIds: Set<Bookmark['id']>;
  isSelectMode: boolean;
};

type SelectionAction =
  | { type: 'TOGGLE_SELECT_MODE' }
  | { type: 'SELECT'; id: Bookmark['id'] }
  | { type: 'DESELECT'; id: Bookmark['id'] }
  | { type: 'SELECT_ALL'; ids: Bookmark['id'][] }
  | { type: 'DESELECT_ALL' };

const SelectionContext = createContext<{
  state: SelectionState;
  dispatch: React.Dispatch<SelectionAction>;
} | null>(null);

const selectionReducer = (
  state: SelectionState,
  action: SelectionAction
): SelectionState => {
  switch (action.type) {
    case 'TOGGLE_SELECT_MODE': {
      return {
        ...state,
        isSelectMode: !state.isSelectMode,
        selectedIds: new Set(),
      };
    }
    case 'SELECT': {
      return {
        ...state,
        selectedIds: new Set(state.selectedIds).add(action.id),
      };
    }
    case 'DESELECT': {
      const newSet = new Set(state.selectedIds);
      newSet.delete(action.id);
      return { ...state, selectedIds: newSet };
    }
    case 'SELECT_ALL': {
      return {
        ...state,
        selectedIds: new Set(action.ids),
      };
    }

    case 'DESELECT_ALL': {
      return {
        ...state,
        selectedIds: new Set(),
      };
    }

    default: {
      return state;
    }
  }
};

export const SelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(selectionReducer, {
    selectedIds: new Set<Bookmark['id']>(),
    isSelectMode: false,
  });

  return (
    <SelectionContext.Provider value={{ state, dispatch }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context)
    throw new Error('useSelection must be used within a SelectionProvider');
  return context;
};
