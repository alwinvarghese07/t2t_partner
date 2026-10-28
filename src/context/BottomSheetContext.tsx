import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  BottomSheetModal,
  BottomSheetOptions
} from '@/components/BottomSheetModal';

interface BottomSheetContextType {
  showBottomSheet: (options: BottomSheetOptions) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<BottomSheetOptions | null>(null);

  const showBottomSheet = useCallback((newOptions: BottomSheetOptions) => {
    setOptions(newOptions);
    setVisible(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <BottomSheetContext.Provider value={{ showBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheetModal
        visible={visible}
        options={options}
        onClose={closeBottomSheet}
      />
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
