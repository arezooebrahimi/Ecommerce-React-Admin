import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";
import { TagItem } from "../../../types/tag";

type TagColumn = Column<TagItem> & {
  key: keyof TagItem | 'actions';
};

export const tagColumns: TagColumn[] = [
  { key: 'name', header: 'نام برچسب' },
  { key: 'slug', header: 'نامک' },    
];

export const tagFilterFields: FilterField[] = [
  { key: 'name', label: 'نام برچسب' },
  { key: 'slug', label: 'نامک' },
]; 