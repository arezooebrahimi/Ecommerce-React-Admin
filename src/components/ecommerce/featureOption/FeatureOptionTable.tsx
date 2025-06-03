import React, { useState } from 'react';
import { featureOptionColumns, featureOptionFilterFields } from './featureOptionTableConfig';
import { FeatureOptionItem } from '../../../types/featureOption';
import { useDeleteFeatureOptionsMutation, useGetPaginatedFeatureOptionsQuery } from '../../../api/featureOptionApi';
import { Filters } from '../../../types/table';
import DataTable from '../../ui/table/DataTable';
import AddFeatureOptionModal from './AddFeatureOptionModal';


interface FeatureOptionTableProps {
  featureId?: string | null;
  defaultFilters?: Filters ;
}

const FeatureOptionTable: React.FC<FeatureOptionTableProps> = ({ defaultFilters,featureId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeatureOptionId, setSelectedFeatureOptionId] = useState<string>();
  const [deleteFeatureOptions, { isLoading: isDeleting }] = useDeleteFeatureOptionsMutation();

  const handleEdit = (id: string) => {
    setSelectedFeatureOptionId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedFeatureOptionId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeatureOptionId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<FeatureOptionItem>
          columns={featureOptionColumns}
          queryHook={useGetPaginatedFeatureOptionsQuery}
          title="گزینه‌های ویژگی"
          onAddClick={handleAdd}
          addButtonText="افزودن گزینه ویژگی جدید"
          filterFields={featureOptionFilterFields}
          defaultSort={{ column: 'createdAt', order: 'desc' }}
          deleteFunc={deleteFeatureOptions}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
          defaultFilters={defaultFilters}
        />
      </div>

      <AddFeatureOptionModal
        show={showModal}
        onClose={handleCloseModal}
        featureOptionId={selectedFeatureOptionId}
        featureId={featureId}
      />
    </>
  );
};

export default FeatureOptionTable; 