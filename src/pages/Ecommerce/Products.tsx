import ProductTable from "../../components/ecommerce/product/ProductTable";

export default function Products() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
           محصولات
        </h2>
      </div>
      <ProductTable />
    </div>
  );
} 