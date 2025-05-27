import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiPlus } from 'react-icons/fi';
import MediaGallery from '../../../components/ecommerce/media/MediaGallery';


const Medias: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedMediaIds(selectedIds);
    console.log('Selected media IDs:', selectedIds);
  };

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              مدیریت رسانه ها
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedMediaIds.length} مورد انتخاب شده
            </p>
          </div>
          <button
            onClick={() => navigate('/add-media')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FiPlus className="w-5 h-5 ml-2" />
            افزودن فایل
          </button>
        </div>
      </div>

      <MediaGallery
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default Medias;

