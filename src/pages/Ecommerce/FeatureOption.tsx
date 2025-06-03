import FeatureOptionTable from "../../components/ecommerce/featureOption/FeatureOptionTable";
import { Filters } from "../../types/table";
import { useLocation } from "react-router";

export default function FeatureOption() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const featureId = searchParams.get('featureId');

  const defaultFilters: Filters = featureId ? {
    featureId: {
      operator: 'and',
      filterModes: [{
        mode: 'equals',
        value: featureId
      }]
    }
  } : {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          گزینه‌های ویژگی
        </h2>
      </div>
      <FeatureOptionTable 
        defaultFilters={defaultFilters}
        featureId={featureId}
      />
    </div>
  );
} 