import React, { useState } from 'react';
import { useGetPaginatedCategoriesQuery } from '../../../api/categoryApi';
import { CategoryItem } from '../../../types/category';
import DataTable from '../../ui/table/DataTable';
import AddCategoryModal from "./AddCategoryModal";
import { categoryColumns, categoryFilterFields } from './categoryTableConfig';

const CategoryTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddCategory = (name: string, slug: string) => {
    console.log("Adding category:", { name, slug });
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<CategoryItem>
          columns={categoryColumns}
          queryHook={useGetPaginatedCategoriesQuery}
          title="دسته‌بندی‌ها"
          onAddClick={() => setShowModal(true)}
          addButtonText="افزودن دسته جدید"
          filterFields={categoryFilterFields}
          defaultSort={{ column: 'name', order: 'desc' }}
        />
      </div>

      <AddCategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddCategory}
      />
    </>
  );
};

export default CategoryTable; 