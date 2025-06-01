import MediaGallery from "./MediaGallery";
import MultiFileUploader from '../common/MultiFileUploader';
import { useState } from "react";
import { useUploadMediaMutation } from "../../../api/mediaApi";
import { toast } from 'react-hot-toast';
import { Formik, Field } from 'formik';
import { MediaItem } from '../../../types/media';
import * as Yup from 'yup';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import { useMedia, MediaFile } from '../../../context/MediaContext';

interface MediaGalleryModalProps {
  show: boolean;
  onClose: () => void;
  multiple?: boolean;
  groupId: string;
}

const validationSchema = Yup.object().shape({
  altText: Yup.string().max(255, 'حداکثر 255 کاراکتر'),
  caption: Yup.string().max(500, 'حداکثر 500 کاراکتر'),
  title: Yup.string().max(100, 'حداکثر 100 کاراکتر'),
});

export default function MediaGalleryModal({
  show,
  onClose,
  multiple = false,
  groupId,
}: MediaGalleryModalProps) {
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery');
  const [activeFileTab, setActiveFileTab] = useState<string | null>(null);
  const { selectedFiles, addFile, removeFile, updateFile, selectAllFiles, getFilesByGroup } = useMedia();
  const currentGroupFiles = groupId ? getFilesByGroup(groupId) : selectedFiles;

  
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const result = await uploadMedia(formData).unwrap();
      const newFiles = result.data.map((file: MediaItem) => ({
        id: file.id,
        url: `${import.meta.env.VITE_MEDIA_STORAGE_URL}/${file.formats.filter(f => f.format === 'thumbnail')[0].filePath}`,
        filePath: file.formats.filter(f => f.format === 'thumbnail')[0].filePath,
        altText: '',
        caption: '',
        title: '',
        isSelected: false,
        groupId,
      }));
      
      if (!multiple) {
        currentGroupFiles.forEach(file => removeFile(file.id, groupId));
        if (newFiles.length > 0) {
          addFile(newFiles[0], groupId);
          setActiveFileTab(newFiles[0].id);
        }
      } else {
        newFiles.forEach((file: MediaFile) => addFile(file, groupId));
        if (newFiles.length > 0 && !activeFileTab) {
          setActiveFileTab(newFiles[0].id);
        }
      }
      setActiveTab('gallery');
      toast.success(`${files.length} فایل با موفقیت آپلود شد`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('خطا در آپلود فایل‌ها');
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    if (selectedFiles.some(f => f.id === file.id && f.groupId === groupId)) {
      removeFile(file.id, groupId);
      if (activeFileTab === file.id) {
        setActiveFileTab(selectedFiles[0]?.id || null);
      }
    } else {
      console.log("addFile");
      addFile({ ...file, groupId }, groupId);
      setActiveFileTab(file.id);
    }
  };


  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-7xl rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === 'upload' ? 'آپلود فایل' : 'انتخاب تصویر'}
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

        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'upload'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              آپلود فایل
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'gallery'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              انتخاب تصویر
            </button>
          </nav>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mt-4 h-[600px] overflow-y-auto">
              {activeTab === 'upload' ? (
                <>
                  <MultiFileUploader
                    onFilesSelected={handleFilesSelected}
                    maxFiles={10}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {isLoading && (
                    <div className="mt-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        در حال آپلود فایل‌ها...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex gap-6">
                  <div className="flex-1">
                    <MediaGallery 
                      onFileSelect={handleFileSelect}
                      multiple={multiple}
                      groupId={groupId}
                    />
                  </div>
                  {currentGroupFiles.length > 0 && (
                    <div className="w-96 border-r border-gray-200 dark:border-gray-700 pr-6">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">فایل‌های انتخاب شده</h4>
                          <button
                            onClick={() => selectAllFiles(groupId)}
                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                          >
                            انتخاب همه
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentGroupFiles.map((file) => (
                            <button
                              key={file.id}
                              onClick={() => setActiveFileTab(file.id)}
                              className={`relative group ${activeFileTab === file.id
                                ? 'ring-2 ring-brand-500'
                                : ''
                              }`}
                            >
                              <img
                                src={file.url}
                                alt={file.altText || ''}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">ویرایش</span>
                              </div>
                              {file.isSelected && (
                                <div className="absolute top-1 right-1 bg-brand-500 rounded-full p-1">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {activeFileTab && (
                        <div className="mt-4">
                          <div className="mb-4">
                            <img
                              src={currentGroupFiles.find(f => f.id === activeFileTab)?.url}
                              alt={currentGroupFiles.find(f => f.id === activeFileTab)?.altText || ''}
                              className="h-32 w-full rounded-lg object-cover mb-4"
                            />
                          </div>
                          <Formik
                            initialValues={{
                              altText: currentGroupFiles.find(f => f.id === activeFileTab)?.altText || '',
                              caption: currentGroupFiles.find(f => f.id === activeFileTab)?.caption || '',
                              title: currentGroupFiles.find(f => f.id === activeFileTab)?.title || '',
                            }}
                            validationSchema={validationSchema}
                            enableReinitialize
                            onSubmit={() => {}}
                          >
                            {({ errors, touched, setFieldValue }) => (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="title">عنوان</Label>
                                  <Field
                                    as={Input}
                                    id="title"
                                    name="title"
                                    placeholder="عنوان را وارد کنید"
                                    error={!!(errors.title && touched.title)}
                                    hint={errors.title && touched.title ? errors.title : ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      setFieldValue('title', e.target.value);
                                      updateFile(activeFileTab!,groupId, { title: e.target.value });
                                    }}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="altText">متن جایگزین</Label>
                                  <Field
                                    as={Input}
                                    id="altText"
                                    name="altText"
                                    placeholder="متن جایگزین را وارد کنید"
                                    error={!!(errors.altText && touched.altText)}
                                    hint={errors.altText && touched.altText ? errors.altText : ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      setFieldValue('altText', e.target.value);
                                      updateFile(activeFileTab!,groupId, { altText: e.target.value });
                                    }}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="caption">توضیحات</Label>
                                  <Field
                                    as="textarea"
                                    id="caption"
                                    name="caption"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                    rows={3}
                                    placeholder="توضیحات را وارد کنید"
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                      setFieldValue('caption', e.target.value);
                                      updateFile(activeFileTab!,groupId, { caption: e.target.value });
                                    }}
                                  />
                                  {errors.caption && touched.caption && (
                                    <div className="text-danger mt-1">{errors.caption}</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Formik>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            انصراف
          </button>
          <button
            onClick={() => {
              currentGroupFiles.forEach(file => {
                updateFile(file.id,file.groupId, { isSelected: true });
              });
              onClose();
            }}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            disabled={currentGroupFiles.length === 0}
          >
            انتخاب ({currentGroupFiles.length})
          </button>
        </div>
      </div>
    </div>
  );
} 