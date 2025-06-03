import BrandTable from "../../components/ecommerce/brand/BrandTable";

export default function Brands() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          برند ها
        </h2>
      </div>
      <BrandTable />
    </div>
  );
} 