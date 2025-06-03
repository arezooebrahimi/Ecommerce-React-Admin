import ProductReviewTable from "../../components/ecommerce/productReview/ProductReviewTable";

export default function ProductsReview() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
           دیدگاه ها
        </h2>
      </div>
        <ProductReviewTable />
    </div>
  );
} 