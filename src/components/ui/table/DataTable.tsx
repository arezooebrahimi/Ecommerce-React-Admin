import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader as TableHeaderComponent,
    TableRow,
} from "./index";
import { SortOrder, Filters, FilterField } from '../../../types/table';
import TableHeader from './TableHeader';
import TableFilter from './TableFilter';
import TablePagination from './TablePagination';

export interface Column<T> {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;
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

interface DataTableProps<T> {
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
}

function DataTable<T>({
    columns,
    queryHook,
    title,
    onAddClick,
    addButtonText,
    filterFields,
    defaultSort,
    itemsPerPage = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ column: keyof T; order: SortOrder }>(
        defaultSort || { column: columns[0].key, order: 'desc' }
    );
    const [filters, setFilters] = useState<Filters>({});
    const [showFilter, setShowFilter] = useState(false);

    const queryParams: QueryParams<T> = {
        page: currentPage,
        perPage: itemsPerPage,
        sort: sortConfig,
        filters: Object.keys(filters).length > 0 ? filters : undefined
    };

    const { data, isLoading, error } = queryHook(queryParams);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">در حال بارگذاری...</div>
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

    const handleSort = (column: keyof T) => {
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

    const getSortIcon = (column: keyof T) => {
        if (!sortConfig || sortConfig.column !== column) return null;
        return sortConfig.order === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="space-y-2">
            {(title || onAddClick) && (
                <TableHeader
                    title={title || ''}
                    onAddClick={onAddClick}
                    addButtonText={addButtonText}
                    onFilterClick={filterFields ? () => setShowFilter(!showFilter) : undefined}
                />
            )}

            {filterFields && (
                <div
                    className={`grid transition-all duration-300 ease-in-out ${
                        showFilter ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
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
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    isHeader
                                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    <button
                                        onClick={() => handleSort(column.key)}
                                        className="flex items-center hover:text-gray-700 w-full text-right"
                                    >
                                        {column.header}
                                        <span className="mr-1">{getSortIcon(column.key)}</span>
                                    </button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeaderComponent>

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data?.data.items.map((item, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={String(column.key)} className="py-3">
                                        {column.render ? (
                                            column.render(item)
                                        ) : (
                                            <p className="text-gray-800 text-theme-sm dark:text-gray-300">
                                                {item[column.key] === null ? '—' : String(item[column.key])}
                                            </p>
                                        )}
                                    </TableCell>
                                ))}
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
        </div>
    );
}

export default DataTable;