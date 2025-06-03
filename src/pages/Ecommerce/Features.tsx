import FeatureTable from "../../components/ecommerce/feature/FeatureTable";

export default function Features() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ویژگی ها
        </h2>
      </div>
      <FeatureTable />
    </div>
  );
} 