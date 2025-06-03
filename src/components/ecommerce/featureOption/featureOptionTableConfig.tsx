import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";
import { FeatureOptionItem } from "../../../types/featureOption";

type FeatureOptionColumn = Column<FeatureOptionItem> & {
  key: keyof FeatureOptionItem | 'actions';
};

export const featureOptionColumns: FeatureOptionColumn[] = [
  { key: 'name', header: 'نام گزینه' },
  { key:'featureName', header: 'ویژگی'},
  { key: 'slug', header: 'نامک' },
  { key: 'order', header: 'ترتیب'}
];

export const featureOptionFilterFields: FilterField[] = [
  { key: 'name', label: 'نام ویژگی' },
  { key: 'slug', label: 'نامک' },
  { key: 'order', label: 'ترتیب' },
]; 