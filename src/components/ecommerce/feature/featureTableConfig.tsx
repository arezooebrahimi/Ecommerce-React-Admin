import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";
import { FeatureItem } from "../../../types/feature";
import { Link } from "react-router";

type FeatureColumn = Column<FeatureItem> & {
  key: keyof FeatureItem | 'actions';
};

export const featureColumns: FeatureColumn[] = [
  { key: 'name', header: 'نام ویژگی' },
  {
    key: 'isFilter',
    header: 'فیلتر هست؟',
    render: (item: FeatureItem) => (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
        {item.isFilter ? 'بله' : 'خیر'}
      </span>
    )
  },
  { key: 'slug', header: 'نامک' },
  {
    key: 'optionsName',
    header: 'گزینه ها',
    render: (item: FeatureItem) => {
      const displayOptions = item.optionsName.slice(0, 3);
      const remainingCount = item.optionsName.length - 3;

      return (
        <div className="flex  gap-2">
          <span className="flex flex-wrap gap-2 items-center">
            {displayOptions.map((option, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                {option}
              </span>
            ))}
            {remainingCount > 0 && (
              <span
                className="text-xs text-gray-600 dark:text-gray-400"
              >
                +{remainingCount} مورد دیگر
              </span>
            )}

          </span>
          <Link
            to={`/feature-options?featureId=${item.id}`}
            className="px-2 py-1 text-[10px] rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
          >
            مدیریت گزینه ها
          </Link>
        </div>
      );
    }
  }
];

export const featureFilterFields: FilterField[] = [
  { key: 'name', label: 'نام ویژگی' },
  { key: 'slug', label: 'نامک' },
  { key: 'description', label: 'توضیحات' },
]; 