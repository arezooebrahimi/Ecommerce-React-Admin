import React, { useState } from 'react';
import { useGetPaginatedCategoriesQuery, useDeleteCategoriesMutation } from '../../../api/categoryApi';
import { CategoryItem } from '../../../types/category';
import { categoryColumns, categoryFilterFields } from './categoryTableConfig';
import DataTable from '../../ui/table/DataTable';
import AddCategoryModal from "./AddCategoryModal";

const CategoryTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [deleteCategories, { isLoading: isDeleting }] = useDeleteCategoriesMutation();

  const handleEdit = (id: string) => {
    setSelectedCategoryId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCategoryId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategoryId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<CategoryItem>
          columns={categoryColumns}
          queryHook={useGetPaginatedCategoriesQuery}
          title="دسته‌بندی‌ها"
          onAddClick={handleAdd}
          addButtonText="افزودن دسته جدید"
          filterFields={categoryFilterFields}
          defaultSort={{ column: 'createdAt', order: 'desc' }}
          deleteFunc={deleteCategories}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
        />
      </div>

      <AddCategoryModal
        show={showModal}
        onClose={handleCloseModal}
        categoryId={selectedCategoryId}
      />
    </>
  );
};

export default CategoryTable; 