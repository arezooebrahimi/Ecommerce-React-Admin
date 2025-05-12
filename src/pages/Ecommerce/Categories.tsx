import CategoryTable from "../../components/ecommerce/category/CategoryTable";

export default function Categories() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          دسته‌بندی محصولات
        </h2>
      </div>
      <CategoryTable />
    </div>
  );
} 