import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { EditIcon, TrashIcon } from "../../../icons";
import AddCategoryModal from "./AddCategoryModal";

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: "لپ‌تاپ",
    slug: "laptop",
    productCount: 15,
  },
  {
    id: 2,
    name: "گوشی هوشمند",
    slug: "smartphone",
    productCount: 25,
  },
  {
    id: 3,
    name: "ساعت",
    slug: "watch",
    productCount: 10,
  },
  {
    id: 4,
    name: "لوازم جانبی",
    slug: "accessories",
    productCount: 30,
  },
  {
    id: 5,
    name: "تبلت",
    slug: "tablet",
    productCount: 12,
  },
  {
    id: 6,
    name: "هدفون",
    slug: "headphone",
    productCount: 18,
  },
  {
    id: 7,
    name: "اسپیکر",
    slug: "speaker",
    productCount: 8,
  },
  {
    id: 8,
    name: "کیبورد",
    slug: "keyboard",
    productCount: 14,
  },
  {
    id: 9,
    name: "ماوس",
    slug: "mouse",
    productCount: 20,
  },
  {
    id: 10,
    name: "مانیتور",
    slug: "monitor",
    productCount: 9,
  },
];

export default function CategoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddCategory = (name: string, slug: string) => {
    // Here you would typically make an API call to add the category
    console.log("Adding category:", { name, slug });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            دسته‌بندی‌ها
          </h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          افزودن دسته جدید
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                نام دسته
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                نامک
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                تعداد محصولات
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                عملیات
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {category.name}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {category.slug}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {category.productCount}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      <EditIcon className="size-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500">
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          نمایش {paginatedCategories.length} از {categories.length} دسته
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            قبلی
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            بعدی
          </button>
        </div>
      </div>

      <AddCategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
} 