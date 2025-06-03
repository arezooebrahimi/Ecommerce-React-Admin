import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";
import { BrandItem } from "../../../types/brand";

type BrandColumn = Column<BrandItem> & {
  key: keyof BrandItem | 'actions';
};

export const brandColumns: BrandColumn[] = [
  { key: 'name', header: 'نام برند' },
  { key: 'description', header: 'توضیحات' },
];

export const brandFilterFields: FilterField[] = [
  { key: 'name', label: 'نام برند' },
  { key: 'description', label: 'توضیحات' },
]; 