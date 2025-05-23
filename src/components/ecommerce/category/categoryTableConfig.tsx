import { EditIcon, TrashIcon } from "../../../icons";
import { CategoryItem } from "../../../types/category";
import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";

export const categoryColumns: Column<CategoryItem>[] = [
  { key: 'name', header: 'نام دسته' },
  { key: 'slug', header: 'نامک' },
  { key: 'parentName', header: 'دسته پدر' },
  {
    key: 'name',
    header: 'عملیات',
    render: (item: CategoryItem) => (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => console.log('Edit category:', item)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <EditIcon className="size-4" />
        </button>
        <button 
          onClick={() => console.log('Delete category:', item)}
          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    )
  }
];

export const categoryFilterFields: FilterField[] = [
  { key: 'name', label: 'نام دسته' },
  { key: 'slug', label: 'نامک' },
  { key: 'parentName', label: 'دسته پدر' }
]; 