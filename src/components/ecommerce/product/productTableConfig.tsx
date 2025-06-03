import { ProductItem } from "../../../types/product";
import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";

type ProductColumn = Column<ProductItem> & {
  key: keyof ProductItem | 'actions';
};

export const productColumns: ProductColumn[] = [
  { key: 'name', header: 'نام محصول' },
  { key: 'slug', header: 'نامک' },
  { 
    key: 'status', 
    header: 'وضعیت',
    render: (item: ProductItem) => {
      if (item.status === 1) {
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">پیش نویس</span>;
      } else if (item.status === 2) {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">منتشر شده</span>;
      }
      return null;
    }
  },
];

export const productFilterFields: FilterField[] = [
  { key: 'name', label: 'نام محصول' },
  { key: 'slug', label: 'نامک' }
]; 