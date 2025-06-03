import React, { useState } from 'react';
import { brandColumns, brandFilterFields } from './brandTableConfig';
import { BrandItem } from '../../../types/brand';
import { useGetPaginatedBrandsQuery, useDeleteBrandsMutation } from '../../../api/brandApi';
import DataTable from '../../ui/table/DataTable';
import AddBandModal from './AddBandModal';

const BrandTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>();
  const [deleteBrands, { isLoading: isDeleting }] = useDeleteBrandsMutation();

  const handleEdit = (id: string) => {
    setSelectedBrandId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedBrandId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBrandId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<BrandItem>
          columns={brandColumns}
          queryHook={useGetPaginatedBrandsQuery}
          title="ویژگی‌ها"
          onAddClick={handleAdd}
          addButtonText="افزودن برند جدید"
          filterFields={brandFilterFields}
          defaultSort={{ column: 'name', order: 'desc' }}
          deleteFunc={deleteBrands}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
        />
      </div>

      <AddBandModal
        show={showModal}
        onClose={handleCloseModal}
        brandId={selectedBrandId}
      />
    </>
  );
};

export default BrandTable; 