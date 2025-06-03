import React, { useState } from 'react';
import { featureColumns, featureFilterFields } from './featureTableConfig';
import DataTable from '../../ui/table/DataTable';
import AddFeatureModal from './AddFeatureModal';
import { FeatureItem } from '../../../types/feature';
import { useGetPaginatedFeaturesQuery, useDeleteFeaturesMutation } from '../../../api/featureApi';

const FeatureTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>();
  const [deleteFeatures, { isLoading: isDeleting }] = useDeleteFeaturesMutation();

  const handleEdit = (id: string) => {
    setSelectedFeatureId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedFeatureId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeatureId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<FeatureItem>
          columns={featureColumns}
          queryHook={useGetPaginatedFeaturesQuery}
          title="ویژگی‌ها"
          onAddClick={handleAdd}
          addButtonText="افزودن ویژگی جدید"
          filterFields={featureFilterFields}
          defaultSort={{ column: 'createdAt', order: 'desc' }}
          deleteFunc={deleteFeatures}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
        />
      </div>

      <AddFeatureModal
        show={showModal}
        onClose={handleCloseModal}
        featureId={selectedFeatureId}
      />
    </>
  );
};

export default FeatureTable; 