import React from 'react';
import { useNavigate } from 'react-router';
import { useUploadMediaMutation } from '../../../api/mediaApi';
import MultiFileUploader from '../../../components/ecommerce/common/MultiFileUploader';
import { toast } from 'react-hot-toast';



const AddMedia: React.FC = () => {
  const navigate = useNavigate();
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      await uploadMedia(formData).unwrap();
      toast.success(`${files.length} فایل با موفقیت آپلود شد`);
      navigate('/medias');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('خطا در آپلود فایل‌ها');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          افزودن رسانه جدید
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          فایل‌های خود را آپلود کنید
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <MultiFileUploader
          onFilesSelected={handleFilesSelected}
          maxFiles={10}
          maxSize={5 * 1024 * 1024} // 5MB
        />

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              در حال آپلود فایل‌ها...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMedia; 