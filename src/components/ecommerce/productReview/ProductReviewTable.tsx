import React, { useState } from 'react';
import { productReviewColumns, productReviewFilterFields } from './productReviewTableConfig';
import DataTable from '../../ui/table/DataTable';
import AddProductReviewModal from "./AddProductReviewModal";      
import { ProductReviewItem } from '../../../types/productReview';
import { useDeleteProductReviewsMutation, useGetPaginatedProductReviewsQuery } from '../../../api/productReviewApi';

const ProductReviewTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProductReviewId, setSelectedProductReviewId] = useState<string>();
  const [deleteProductReviews, { isLoading: isDeleting }] = useDeleteProductReviewsMutation();

  const handleEdit = (id: string) => {
    setSelectedProductReviewId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedProductReviewId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductReviewId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<ProductReviewItem>
          columns={productReviewColumns}
          queryHook={useGetPaginatedProductReviewsQuery}
          title="دیدیگاه ها"
          onAddClick={handleAdd}
          addButtonText="افزودن دیدگاه جدید"
          filterFields={productReviewFilterFields}
          defaultSort={{ column: 'createdAt', order: 'desc' }}
          deleteFunc={deleteProductReviews}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
        />
      </div>

      <AddProductReviewModal
        show={showModal}
        onClose={handleCloseModal}
        productReviewId={selectedProductReviewId}
      />
    </>
  );
};

export default ProductReviewTable; 