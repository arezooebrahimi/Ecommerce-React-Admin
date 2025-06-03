import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader as TableHeaderComponent,
    TableRow,
} from "./index";
import { SortOrder, Filters, DeleteDataResponse, FilterField } from '../../../types/table';
import TableHeader from './TableHeader';
import TableFilter from './TableFilter';
import TablePagination from './TablePagination';
import DeleteConfirmModal from '../../ecommerce/common/DeleteConfirmModal';
import Checkbox from '../../form/input/Checkbox';
import LoadingSpinner from '../../common/LoadingSpinner';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

export interface QueryParams<T> {
    page: number;
    perPage: number;
    sort?: {
        column: keyof T;
        order: SortOrder;
    };
    filters?: Filters;
}

export interface QueryResponse<T> {
    data: {
        items: T[];
        total: number;
    };
    isSuccess: boolean;
    statusCode: number;
    message: string;
}

interface DataTableProps<T extends { id: string | number }> {
    columns: Column<T>[];
    queryHook: (params: QueryParams<T>) => {
        data?: QueryResponse<T>;
        isLoading: boolean;
        error?: unknown;
    };
    title?: string;
    onAddClick?: () => void;
    addButtonText?: string;
    filterFields?: FilterField[];
    defaultSort?: {
        column: keyof T;
        order: SortOrder;
    };
    itemsPerPage?: number;
    deleteFunc?: (params: string[]) => Promise<{ data: DeleteDataResponse } | { error: unknown }>;
    isLoadingDelete?: boolean;
    onEdit?: (id: string) => void;
    defaultFilters?: Filters;
}

function DataTable<T extends { id: string | number }>({
    columns,
    queryHook,
    title,
    onAddClick,
    addButtonText,
    filterFields,
    defaultSort,
    itemsPerPage = 10,
    deleteFunc,
    isLoadingDelete,
    onEdit,
    defaultFilters
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ column: keyof T; order: SortOrder }>(
        defaultSort || { column: columns[0].key as keyof T, order: 'desc' }
    );
    const [filters, setFilters] = useState<Filters>(defaultFilters || {});
    const [showFilter, setShowFilter] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const queryParams: QueryParams<T> = {
        page: currentPage,
        perPage: itemsPerPage,
        sort: sortConfig,
        filters: Object.keys(filters).length > 0 ? filters : undefined
    };

    const { data, isLoading, error } = queryHook(queryParams);

    if (isLoading || isLoadingDelete) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                خطا در دریافت اطلاعات: {error instanceof Error ? error.message : 'خطای ناشناخته'}
            </div>
        );
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleSort = (column: keyof T | string) => {
        if (typeof column === 'string') return;
        setSortConfig(prev => ({
            column,
            order: prev.column === column && prev.order === 'desc' ? 'asc' : 'desc'
        }));
        setCurrentPage(1);
    };

    const handleFilter = (newFilters: Filters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    const getSortIcon = (column: keyof T | string) => {
        if (typeof column === 'string') return null;
        if (!sortConfig || sortConfig.column !== column) return null;
        return sortConfig.order === 'asc' ? '↑' : '↓';
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedItems(prev => {
            if (checked) {
                return [...prev, id];
            } else {
                return prev.filter(itemId => itemId !== id);
            }
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(data?.data.items.map(item => item.id.toString()) || []);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSingleDelete = (id: string) => {
        setSelectedItems([id]);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!deleteFunc) return;

        try {
            const response = await deleteFunc(selectedItems.map(id => id.toString()));
            if ('error' in response || !response.data.isSuccess) {
                throw new Error('Failed to delete items');
            }
            setShowDeleteModal(false);
            setSelectedItems([]);
        } catch (error) {
            console.error("Error deleting items:", error);
        }
    };

    return (
        <div className="space-y-2">
            {(title || onAddClick) && (
                <TableHeader
                    title={title || ''}
                    onAddClick={onAddClick}
                    addButtonText={addButtonText}
                    onFilterClick={filterFields ? () => setShowFilter(!showFilter) : undefined}
                    onDeleteClick={selectedItems.length > 0 ? () => setShowDeleteModal(true) : undefined}
                />
            )}

            {filterFields && (
                <div
                    className={`grid transition-all duration-300 ease-in-out ${showFilter ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                >
                    <div className="overflow-hidden">
                        <TableFilter
                            fields={filterFields}
                            onFilter={handleFilter}
                            onClear={handleClearFilters}
                        />
                    </div>
                </div>
            )}
            <div className='px-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                <Table>
                    <TableHeaderComponent className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            {deleteFunc && (
                                <TableCell className="py-3 w-12">
                                    <Checkbox
                                        checked={selectedItems.length === (data?.data.items.length || 0)}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    isHeader
                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {column.sortable !== false ? (
                                        <button
                                            onClick={() => handleSort(column.key as keyof T)}
                                            className="flex items-center hover:text-gray-700 w-full text-right"
                                        >
                                            {column.header}
                                            <span className="mr-1">{getSortIcon(column.key as keyof T)}</span>
                                        </button>
                                    ) : (
                                        <span className="text-right">{column.header}</span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeaderComponent>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data?.data.items.map((item, index) => (
                            <TableRow key={index}>
                                {deleteFunc && (
                                    <TableCell className="py-3 w-12">
                                        <Checkbox
                                            checked={selectedItems.includes(item.id.toString())}
                                            onChange={(checked) => handleCheckboxChange(item.id.toString(), checked)}
                                        />
                                    </TableCell>
                                )}
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)} className="py-3">
                                        {column.render ? (
                                            column.render(item)
                                        ) : (
                                            <p className="text-gray-800 text-theme-sm dark:text-gray-300">
                                                {item[column.key as keyof T] === null ? '—' : String(item[column.key as keyof T])}
                                            </p>
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell className="py-3 w-24">
                                    <div className="flex items-center gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item.id.toString())}
                                                className="text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <svg
                                                    className="size-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                        {deleteFunc && (
                                            <button
                                                onClick={() => handleSingleDelete(item.id.toString())}
                                                className="text-red-500 hover:text-red-600 transition-colors"
                                            >
                                                <svg
                                                    className="size-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

            {data && (
                <TablePagination
                    currentPage={currentPage}
                    totalItems={data.data.total}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}

            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedItems([]);
                }}
                onConfirm={handleDelete}
                title="حذف آیتم‌ها"
                message="آیا از حذف آیتم‌های انتخاب شده اطمینان دارید؟"
                count={selectedItems.length}
            />
        </div>
    );
}

export default DataTable;