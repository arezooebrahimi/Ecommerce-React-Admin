import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  useGetMediaMutation,
  useDeleteMediaMutation,
} from "../../../api/mediaApi";
import { MediaItem } from "../../../types/media";
import { MediaFile,useMedia } from "../../../context/MediaContext";
import { FiCopy, FiTrash2, FiImage, FiFile, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Checkbox from "../../form/input/Checkbox";
import DetailMediaModal from "./DetailMediaModal";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import debounce from "lodash.debounce";


interface MediaGalleryProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  onFileSelect: (file: MediaFile) => void;
  multiple?: boolean;
  groupId: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ onSelectionChange, onFileSelect, multiple = false, groupId }) => {
  const [getMedia, { data, isLoading }] = useGetMediaMutation();
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<MediaItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaItem | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedFiles,removeFile,addFile } = useMedia();
  const MEDIA_STORAGE_URL = import.meta.env.VITE_MEDIA_STORAGE_URL
  const itemsPerPage = 12;

  const fetchMedia = useCallback(async (query: string = '') => {
    try {
      await getMedia({
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        filter: query,
      });
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to fetch media items');
    }
  }, [getMedia, page, itemsPerPage]);

  // Memoize the debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      fetchMedia(query);
    }, 500),
    [fetchMedia]
  );

  // Effect for initial load and page changes
  useEffect(() => {
    if (!searchQuery) {
      fetchMedia();
    }
  }, [page, fetchMedia, searchQuery]);

  // Effect for search
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      setPage(1);
      fetchMedia();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  const handleCopyPath = (path: string) => {
    const fullPath = `${MEDIA_STORAGE_URL}/${path}`;
    navigator.clipboard.writeText(fullPath);
    toast.success('آدرس فایل در کلیپ‌بورد کپی شد');
  };

  const handleDelete = async (id: string) => {
    const file = data?.data.items.find(item => item.id === id);
    if (file) {
      setFileToDelete(file);
      setIsBulkDelete(false);
      setDeleteModalOpen(true);
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    if (selectedFiles.some(f => f.id === file.id)) {
      removeFile(file.id, groupId);
    } else {
      addFile({ ...file, groupId }, groupId);
    }
  }


  const handleConfirmDelete = async () => {
    try {
      if (isBulkDelete) {
        await deleteMedia(selectedFiles.map(f => f.id)).unwrap();
        toast.success(`${selectedFiles.length} فایل با موفقیت حذف شد`);
        onSelectionChange?.([]);
      } else if (fileToDelete) {
        await deleteMedia([fileToDelete.id]).unwrap();
        toast.success('فایل با موفقیت حذف شد');
      }
      fetchMedia(searchQuery); // Pass current search query
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting files:', error);
      toast.error('خطا در حذف فایل‌ها');
    } finally {
      setFileToDelete(null);
      setIsBulkDelete(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FiImage className="w-10 h-10 text-gray-400 dark:text-gray-600" />;
    }
    return <FiFile className="w-10 h-10 text-gray-400 dark:text-gray-600" />;
  };

  const getThumbnailUrl = (item: MediaItem) => {
    const thumbnail = item.formats.find((format) => format.format === 'thumbnail');
    return thumbnail ? `${MEDIA_STORAGE_URL}/${thumbnail.filePath}` : '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fa-IR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="جستجو بر اساس نام فایل..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedFiles.length} فایل انتخاب شده
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsBulkDelete(true);
                setDeleteModalOpen(true);
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>در حال حذف...</span>
                </div>
              ) : (
                'حذف انتخاب شده‌ها'
              )}
            </button>
          </div>
        </div>
      )}

      {!isLoading && (!data?.data.items || data.data.items.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <FiImage className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">هیچ فایلی یافت نشد</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            هنوز هیچ فایلی آپلود نشده است. برای شروع، فایل‌های خود را آپلود کنید.
          </p>
        </div>
      )}

      {data?.data.items && data.data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative group"
            >
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedFiles.some(f => f.id === item.id && f.groupId === groupId)}
                  onChange={(checked) => {
                    const mediaFile: MediaFile = {
                      id: item.id,
                      url: getThumbnailUrl(item),
                      filePath: item.filePath,
                      altText: '',
                      caption: '',
                      title: '',
                      isSelected: checked,
                      groupId,
                    };

                    // If not multiple and trying to select a new file, deselect all others first
                    if (!multiple && checked) {
                      selectedFiles.forEach(file => {
                        if (file.id !== item.id && file.groupId === groupId) {
                          const unselectFile: MediaFile = {
                            ...file,
                            isSelected: false
                          };

                          if (onFileSelect) {
                            onFileSelect(unselectFile);
                          }
                        }
                      });
                    }

                    if (onFileSelect) {
                      onFileSelect(mediaFile);
                    }else{
                      handleFileSelect(mediaFile);
                    }
                  }}
                />
              </div>

              <div 
                className="h-48 bg-gray-50 dark:bg-gray-700 rounded-t-lg flex items-center justify-center relative overflow-hidden cursor-pointer"
                onClick={() => {
                  const mediaFile: MediaFile = {
                    id: item.id,
                    url: getThumbnailUrl(item),
                    filePath: item.filePath,
                    altText: '',
                    caption: '',
                    title: '',
                    isSelected: !selectedFiles.find(f => f.id === item.id && f.groupId === groupId)?.isSelected,
                    groupId,
                  };

                  // If not multiple and trying to select a new file, deselect all others first
                  if (!multiple && !selectedFiles.find(f => f.id === item.id && f.groupId === groupId)?.isSelected) {
                    selectedFiles.forEach(file => {
                      if (file.id !== item.id && file.groupId === groupId) {
                        const unselectFile: MediaFile = {
                          ...file,
                          isSelected: false
                        };
                        onFileSelect(unselectFile);
                      }
                    });
                  }

                  onFileSelect(mediaFile);
                }}
              >
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={getThumbnailUrl(item)}
                    alt={item.fileName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  getFileIcon(item.mimeType)
                )}
              </div>

              <div className="p-4">
                <h3 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setSelectedFile(item)}
                >
                  {item.fileName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(item.size / 1024).toFixed(2)} KB
                </p>

                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleCopyPath(item.filePath)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="کپی آدرس فایل"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="حذف"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(data.data.total / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  page === i + 1
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setFileToDelete(null);
            setIsBulkDelete(false);
          }
        }}
        onConfirm={handleConfirmDelete}
        title={isBulkDelete ? "حذف فایل‌های انتخاب شده" : "حذف فایل"}
        message={isBulkDelete 
          ? `آیا از حذف ${selectedFiles.length} فایل انتخاب شده اطمینان دارید؟`
          : `آیا از حذف فایل "${fileToDelete?.fileName}" اطمینان دارید؟`
        }
        count={isBulkDelete ? selectedFiles.length : 0}
        isLoading={isDeleting}
      />

      {/* File Details Modal */}
      {selectedFile && (
        <DetailMediaModal
          show={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          selectedFile={selectedFile}
          MEDIA_STORAGE_URL={MEDIA_STORAGE_URL}
          handleCopyPath={handleCopyPath}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};


export default MediaGallery;