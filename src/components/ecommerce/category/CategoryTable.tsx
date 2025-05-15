import React, { useEffect, useState } from 'react';
import { useGetPaginatedCategoriesMutation } from '../../../api/categoryApi';
import { PaginatedCategoriesResponse } from '../../../types/category';
import { EditIcon, TrashIcon } from "../../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Alert from '../../ui/alert/Alert';
import AddCategoryModal from "./AddCategoryModal";


const CategoryTable: React.FC = () => {
  const [getPaginatedCategories, { isLoading, error }] = useGetPaginatedCategoriesMutation();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<PaginatedCategoriesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async (page: number) => {
    try {
      const result = await getPaginatedCategories({ page, perPage: itemsPerPage }).unwrap();
      setCategories(result);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleAddCategory = (name: string, slug: string) => {
    console.log("Adding category:", { name, slug });
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="error"
        title="خطا"
        message="دریافت اطلاعات با خطا مواجه شد !!!"
        showLink={true}
        linkHref="/"
        linkText="گزارش خطا"
      />
    );
  }

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
                دسته پدر
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
            {categories?.data.items.map((category) => (
              <TableRow key={category.slug}>
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {category.name}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {category.slug}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {category.parentName || '-'}
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

      {
        categories && 
         <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          نمایش {((currentPage-1)*itemsPerPage)+categories.data.items.length} از {categories.data.total} دسته
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            قبلی
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
             صفحه {currentPage} از {Math.ceil(categories.data.total / itemsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === categories.data.total}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            بعدی
          </button>
        </div>
      </div>
      }
     

      <AddCategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
};

export default CategoryTable; 