import { Column } from "../../ui/table/DataTable";
import { FilterField } from "../../../types/table";
import { ProductReviewItem } from "../../../types/productReview";

type ProductReviewColumn = Column<ProductReviewItem> & {
  key: keyof ProductReviewItem | 'actions';
};

export const productReviewColumns: ProductReviewColumn[] = [
  {
    key: 'name', header: 'ارسال کننده', render: (item: ProductReviewItem) => {
      if (item.isUser) {
        return <>
          <span className="text-sm text-gray-700 dark:text-gray-200">{item.name} </span>
          <span className="px-2 py-1 text-[10px] rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">کاربر</span>
        </>;
      }
      return <>
        <span className="text-sm text-gray-700 dark:text-gray-200">{item.name} </span>
        <span className="px-2 py-1 text-[10px] rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">مهمان</span>
      </>;
    }
  },
  { key: 'title', header: 'عنوان' },
  { 
    key: 'reviewText', 
    header: 'متن',
    render: (item: ProductReviewItem) => (
      <div className="relative group cursor-pointer">
        <p className="truncate max-w-[200px] text-sm text-gray-600 dark:text-gray-300">
          {item.reviewText}
        </p>
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 max-w-[300px] break-words">
            {item.reviewText}
          </div>
          <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-4"></div>
        </div>
      </div>
    )
  },
  { key: 'rating', header: 'امتیاز' },
  { key: 'productName', header: 'نام محصول' },
  { key: 'createdAt', header: 'تاریخ ایجاد' },
  {
    key: 'isApproved', header: 'تایید شده',
    render: (item: ProductReviewItem) => {
      if (item.isApproved) {
        return <span className="px-2 py-1 text-[10px] rounded-full bg-green-100 text-green-600">تایید شده</span>;
      }
      return <span className="px-2 py-1 text-[10px] rounded-full bg-red-100 text-red-600">تایید نشده</span>;
    }
  },
];
export const productReviewFilterFields: FilterField[] = [
  { key: 'title', label: 'عنوان' },
  { key: 'reviewText', label: 'متن' },
  { key: 'rating', label: 'امتیاز' },
  { key: 'productName', label: 'نام محصول' },
  { key: 'createdAt', label: 'تاریخ ایجاد' }
]; 