import TagTable from "../../components/ecommerce/tag/TagTable";

export default function Tags() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          برچسب ها
        </h2>
      </div>
      <TagTable />
    </div>
  );
} 