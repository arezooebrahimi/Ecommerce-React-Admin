import React, { useState } from 'react';
import { useGetPaginatedCategoriesQuery } from '../../../api/categoryApi';
import { SortOrder, CategoryItem, Filters, FilterMode} from '../../../types/category';
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

type SortConfig = {
  column: keyof CategoryItem;
  order: SortOrder;
};

type FilterInput = {
  field: keyof CategoryItem;
  mode: FilterMode;
  value: string;
  operator: 'and' | 'or';
};

const CategoryTable: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'name',
    order: 'desc'
  });
  const [filters, setFilters] = useState<Filters>({});
  const [filterInputs, setFilterInputs] = useState<FilterInput[]>([
    { field: 'name', mode: 'contains', value: '', operator: 'and' }
  ]);
  const itemsPerPage = 10;

  const { data: categories, isLoading, error } = useGetPaginatedCategoriesQuery({
    page: currentPage,
    perPage: itemsPerPage,
    sort: sortConfig,
    filters: Object.keys(filters).length > 0 ? filters : undefined
  });


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSort = (column: keyof CategoryItem) => {
    setSortConfig(prev => ({
      column,
      order: prev.column === column && prev.order === 'desc' ? 'asc' : 'desc'
    }));
    setCurrentPage(1);
  };

  const addFilterInput = () => {
    setFilterInputs(prev => [...prev, { field: 'name', mode: 'contains', value: '', operator: 'and' }]);
  };

  const removeFilterInput = (index: number) => {
    setFilterInputs(prev => prev.filter((_, i) => i !== index));
  };

  const updateFilterInput = (index: number, updates: Partial<FilterInput>) => {
    setFilterInputs(prev => prev.map((input, i) => 
      i === index ? { ...input, ...updates } : input
    ));
  };

  const handleFilter = () => {
    const newFilters: Filters = {};
    
    filterInputs.forEach(input => {
      if (!input.value.trim()) return;

      if (!newFilters[input.field]) {
        newFilters[input.field] = {
          operator: input.operator,
          filterModes: []
        };
      }

      newFilters[input.field].filterModes.push({
        mode: input.mode,
        value: input.value.trim()
      });
    });

    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilterInputs([{ field: 'name', mode: 'contains', value: '', operator: 'and' }]);
    setCurrentPage(1);
  };

  const getSortIcon = (column: keyof CategoryItem) => {
    if (sortConfig.column !== column) return null;
    return sortConfig.order === 'asc' ? '↑' : '↓';
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
    <>
      <div className="mb-4 space-y-4">
        {filterInputs.map((input, index) => (
          <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1 flex gap-2">
              {index > 0 && (
                <select
                  value={input.operator}
                  onChange={(e) => updateFilterInput(index, { operator: e.target.value as 'and' | 'or' })}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <option value="and">و</option>
                  <option value="or">یا</option>
                </select>
              )}
              <select
                value={input.field}
                onChange={(e) => updateFilterInput(index, { field: e.target.value as keyof CategoryItem })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                <option value="name">نام دسته</option>
                <option value="slug">نامک</option>
                <option value="parentName">دسته پدر</option>
              </select>
              <select
                value={input.mode}
                onChange={(e) => updateFilterInput(index, { mode: e.target.value as FilterMode })}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                <option value="contains">شامل</option>
                <option value="equals">برابر</option>
                <option value="startsWith">شروع با</option>
                <option value="endsWith">پایان با</option>
              </select>
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input.value}
                    onChange={(e) => updateFilterInput(index, { value: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                    placeholder="جستجو..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => removeFilterInput(index)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  )}
                </div>
                {index === 0 && (
                  <>
                    <button
                      onClick={addFilterInput}
                      className="whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                    >
                      افزودن فیلتر
                    </button>
                    <button
                      onClick={handleFilter}
                      className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      اعمال فیلترها
                    </button>
                    {Object.keys(filters).length > 0 && (
                      <button
                        onClick={handleClearFilters}
                        className="whitespace-nowrap rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        حذف فیلترها
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              دسته‌بندی‌ها
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              افزودن دسته جدید
            </button>
          </div>


        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
              <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center hover:text-gray-700 w-full text-right"
                  >
                    نام دسته
                    <span className="mr-1">{getSortIcon('name')}</span>
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('slug')}
                    className="flex items-center hover:text-gray-700 w-full text-right"
                  >
                    نامک
                    <span className="mr-1">{getSortIcon('slug')}</span>
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <button
                    onClick={() => handleSort('parentName')}
                    className="flex items-center hover:text-gray-700 w-full text-right"
                  >
                    دسته پدر
                    <span className="mr-1">{getSortIcon('parentName')}</span>
                  </button>
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
              نمایش {((currentPage - 1) * itemsPerPage) + categories.data.items.length} از {categories.data.total} دسته
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
                disabled={currentPage >= Math.ceil(categories.data.total / itemsPerPage)}
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
    </>
  );
};

export default CategoryTable; 