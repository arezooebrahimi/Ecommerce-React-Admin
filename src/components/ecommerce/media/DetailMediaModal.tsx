import { FiX, FiCopy } from 'react-icons/fi';
import { MediaItem } from '../../../types/media';

interface DetailMediaModalProps {
    show: boolean;
    onClose: () => void;
    selectedFile: MediaItem;
    MEDIA_STORAGE_URL: string;
    handleCopyPath: (path: string) => void;
    formatDate: (date: string) => string;
}

export default function DetailMediaModal({
    show,
    onClose,
    selectedFile,
    MEDIA_STORAGE_URL,
    handleCopyPath,
    formatDate
}: DetailMediaModalProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        جزئیات فایل
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">نام فایل</p>
                            <p className="text-gray-900 dark:text-white">{selectedFile.fileName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">نوع فایل</p>
                            <p className="text-gray-900 dark:text-white">{selectedFile.mimeType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">حجم</p>
                            <p className="text-gray-900 dark:text-white">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">تاریخ ایجاد</p>
                            <p className="text-gray-900 dark:text-white">{formatDate(selectedFile.createdAt)}</p>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 dark:text-gray-400">آدرس کامل فایل</p>
                                <button
                                    onClick={() => handleCopyPath(selectedFile.filePath)}
                                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="کپی آدرس"
                                >
                                    <FiCopy className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-gray-900 dark:text-white break-all mt-1">
                                {`${MEDIA_STORAGE_URL}/${selectedFile.filePath}`}
                            </p>
                        </div>
                    </div>

                    {selectedFile.formats && selectedFile.formats.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">فرمت‌های موجود</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedFile.formats.map((format, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{format.format}</p>
                                            <button
                                                onClick={() => handleCopyPath(format.filePath)}
                                                className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title="کپی آدرس"
                                            >
                                                <FiCopy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {format.width}x{format.height} - {format.ext}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                            {`${MEDIA_STORAGE_URL}/${format.filePath}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 