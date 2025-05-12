import { useState } from "react";

interface AddCategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (name: string, slug: string) => void;
}

export default function AddCategoryModal({
  show,
  onClose,
  onSave,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleSave = () => {
    if (name && slug) {
      onSave(name, slug);
      setName("");
      setSlug("");
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            افزودن دسته جدید
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              نام دسته
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              نامک
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
} 