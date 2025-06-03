import React, { useState } from 'react';
import { tagColumns, tagFilterFields } from './tagTableConfig';
import { TagItem } from '../../../types/tag';
import { useGetPaginatedTagsQuery, useDeleteTagsMutation } from '../../../api/tagApi';
import DataTable from '../../ui/table/DataTable';
import AddTagModal from './AddTagModal';

const TagTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string>();
  const [deleteTags, { isLoading: isDeleting }] = useDeleteTagsMutation();

  const handleEdit = (id: string) => {
    setSelectedTagId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTagId(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTagId(undefined);
  };

  return (
    <>
      <div className="p-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <DataTable<TagItem>
          columns={tagColumns}
          queryHook={useGetPaginatedTagsQuery}
          title="برچسب"
          onAddClick={handleAdd}
          addButtonText="افزودن برچسب جدید"
          filterFields={tagFilterFields}
          defaultSort={{ column: 'createdAt', order: 'desc' }}
          deleteFunc={deleteTags}
          isLoadingDelete={isDeleting}
          onEdit={handleEdit}
        />
      </div>

      <AddTagModal
        show={showModal}
        onClose={handleCloseModal}
        tagId={selectedTagId}
      />
    </>
  );
};

export default TagTable; 