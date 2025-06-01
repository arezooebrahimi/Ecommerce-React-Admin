import { createContext, useContext, useState, ReactNode } from 'react';

export interface MediaFile {
  id: string;
  url: string;
  altText?: string;
  caption?: string;
  title?: string;
  filePath: string;
  isSelected: boolean;
  groupId: string; 
}

interface MediaContextType {
  selectedFiles: MediaFile[];
  getFilesByGroup: (groupId: string) => MediaFile[];
  addFile: (file: MediaFile, groupId: string) => void;
  removeFile: (fileId: string, groupId?: string) => void;
  updateFile: (fileId: string,groupId: string, data: Partial<MediaFile>) => void;
  clearFiles: (groupId?: string) => void;
  selectAllFiles: (groupId?: string) => void;
  clearAllFiles: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);

  const getFilesByGroup = (groupId: string) => {
    return selectedFiles.filter(file => file.groupId === groupId);
  };

  const addFile = (file: MediaFile, groupId: string) => {
    setSelectedFiles(prev => {
      if (prev.some(f => f.id === file.id && f.groupId === groupId)) {
        return prev;
      }
      return [...prev, { ...file, isSelected: false, groupId }];
    });
  };

  const removeFile = (fileId: string, groupId?: string) => {
    setSelectedFiles(prev => 
      prev.filter(file => !(file.id === fileId && (!groupId || file.groupId === groupId)))
    );
  };

  const updateFile = (fileId: string,groupId: string, data: Partial<MediaFile>) => {
    setSelectedFiles(prev => prev.map(file => 
      file.id === fileId && file.groupId === groupId ? { ...file, ...data } : file
    ));
  };

  const clearFiles = (groupId?: string) => {
    setSelectedFiles(prev => 
      groupId ? prev.filter(file => file.groupId !== groupId) : []
    );
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const selectAllFiles = (groupId?: string) => {
    setSelectedFiles(prev => prev.map(file => 
      (!groupId || file.groupId === groupId) ? { ...file, isSelected: true } : file
    ));
  };

  return (
    <MediaContext.Provider value={{
      selectedFiles,
      getFilesByGroup,
      addFile,
      removeFile,
      updateFile,
      clearFiles,
      selectAllFiles,
      clearAllFiles,
    }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
} 