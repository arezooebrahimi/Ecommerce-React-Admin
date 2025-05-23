import React, { useState } from 'react';
import { TrashIcon } from "../../../icons";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { FilterInput, FilterField, FilterMode } from '../../../types/table';


interface TableFilterProps {
  fields: FilterField[];
  onFilter: (filters: Record<string, { operator: 'and' | 'or', filterModes: { mode: FilterMode, value: string }[] }>) => void;
  onClear: () => void;
}

const TableFilter: React.FC<TableFilterProps> = ({
  fields,
  onFilter,
  onClear,
}) => {
  const [filterInputs, setFilterInputs] = useState<FilterInput[]>([
    { field: fields[0].key, mode: 'contains', value: '', operator: 'and' }
  ]);

  const addFilterInput = () => {
    setFilterInputs(prev => [...prev, { field: fields[0].key, mode: 'contains', value: '', operator: 'and' }]);
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
    const newFilters: Record<string, { operator: 'and' | 'or', filterModes: { mode: FilterMode, value: string }[] }> = {};

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

    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setFilterInputs([{ field: fields[0].key, mode: 'contains', value: '', operator: 'and' }]);
    onClear();
  };

  return (
    <div className="my-4 space-y-4">
      <div className="grid grid-cols-12 gap-2 w-full">
        <div className="col-span-10">
          {filterInputs.map((input, index) => (
            <div key={index} className="flex flex-col gap-2 mb-2 w-full">
              <div className="grid grid-cols-12 gap-2 w-full">
                {index > 0 ? (
                  <div className="col-span-1">
                    <Select
                      options={[
                        { value: 'and', label: 'و' },
                        { value: 'or', label: 'یا' }
                      ]}
                      defaultValue={input.operator}
                      onChange={(value) => updateFilterInput(index, { operator: value as 'and' | 'or' })}
                      className="dark:bg-dark-900"
                      placeholder=""
                    />
                  </div>
                ) : <div className="col-span-1"></div>}
                <div className="col-span-2">
                  <Select
                    options={fields.map(field => ({ value: field.key, label: field.label }))}
                    defaultValue={input.field}
                    onChange={(value) => updateFilterInput(index, { field: value })}
                    className="dark:bg-dark-900"
                    placeholder=""
                  />
                </div>
                <div className="col-span-1">
                  <Select
                    options={[
                      { value: 'contains', label: 'شامل' },
                      { value: 'equals', label: 'برابر' },
                      { value: 'startsWith', label: 'شروع با' },
                      { value: 'endsWith', label: 'پایان با' }
                    ]}
                    defaultValue={input.mode}
                    onChange={(value) => updateFilterInput(index, { mode: value as FilterMode })}
                    placeholder=""
                  />
                </div>
                <div className="col-span-7">
                  <Input
                    type="text"
                    value={input.value}
                    onChange={(e) => updateFilterInput(index, { value: e.target.value })}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        handleFilter();
                      }
                    }}
                    placeholder="جستجو..."
                  />
                </div>
                {index > 0 && (
                  <div className="col-span-1">
                    <button
                      onClick={() => removeFilterInput(index)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-2">
          <div className="flex gap-2 justify-end">
            <button
              onClick={addFilterInput}
              className="whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              افزودن فیلتر
            </button>
            <button
              onClick={handleFilter}
              className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white dark:bg-blue-500"
            >
              اعمال فیلترها
            </button>
            <button
              onClick={handleClearFilters}
              className="whitespace-nowrap rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 dark:border-red-700 dark:bg-gray-800 dark:text-red-400"
            >
              حذف فیلترها
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableFilter; 