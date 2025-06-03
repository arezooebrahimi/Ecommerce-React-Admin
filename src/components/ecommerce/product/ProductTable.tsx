import React, { useState } from 'react';
import { useGetPaginatedProductsQuery, useDeleteProductsMutation } from '../../../api/productApi';
import { ProductItem } from '../../../types/product';
import { productColumns, productFilterFields } from './productTableConfig';
import DataTable from '../../ui/table/DataTable';
import AddCategoryModal from "./AddProductModal";

const ProductTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [deleteProducts, { isLoading: isDeleting }] = useDeleteProductsMutation();

  const handleEdit = (id: string) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedProductId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<ProductItem>
          columns={productColumns}
          queryHook={useGetPaginatedProductsQuery}
          title="محصولات"
          onAddClick={handleAdd}
          addButtonText="افزودن محصول جدید"
          filterFields={productFilterFields}
          defaultSort={{ column: 'createdAt', order: 'desc' }}
          deleteFunc={deleteProducts}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
        />
      </div>

      <AddCategoryModal
        show={showModal}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
    </>
  );
};

export default ProductTable; 