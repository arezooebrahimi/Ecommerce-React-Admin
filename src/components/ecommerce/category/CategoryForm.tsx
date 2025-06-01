import * as Yup from 'yup';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Formik, Form, FormikContextType, FormikHelpers } from 'formik';
import { useAddCategoryMutation, useGetParentCategoriesQuery, useGetCategoryByIdQuery, useEditCategoryMutation } from '../../../api/categoryApi';
import { useGetMediaByIdMutation } from '../../../api/mediaApi';
import { useMedia, MediaFile } from '../../../context/MediaContext';
import { AddCategoryRequest } from '../../../types/category';
import { MediaFormat } from '../../../types/media';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import TextArea from '../../../components/form/input/TextArea';
import Checkbox from '../../../components/form/input/Checkbox';
import MediaGalleryModal from '../media/MediaGalleryModal';
import SeoForm from '../common/SeoForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Media } from '../../../types/common';

interface CategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  categoryId?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('نام دسته الزامی است')
    .min(2, 'نام دسته باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام دسته نمی‌تواند بیشتر از 50 کاراکتر باشد'),
  description: Yup.string()
    .max(500, 'توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد'),
  order: Yup.number()
    .typeError('ترتیب باید عدد باشد')
    .min(0, 'ترتیب نمی‌تواند منفی باشد'),
  slug: Yup.string()
    .required('اسلاگ الزامی است')
    .matches(/^[a-z0-9-]+$/, 'اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد'),
  parentId: Yup.string().nullable(),
  displayOnHomePage: Yup.boolean(),
  orderOnHomePage: Yup.number()
    .typeError('ترتیب نمایش در صفحه اصلی باید عدد باشد')
    .min(0, 'ترتیب نمایش در صفحه اصلی نمی‌تواند منفی باشد'),
  seoTitle: Yup.string()
    .max(60, 'عنوان سئو نمی‌تواند بیشتر از 60 کاراکتر باشد'),
  metaDescription: Yup.string()
    .max(160, 'توضیحات متا نمی‌تواند بیشتر از 160 کاراکتر باشد'),
  canonicalUrl: Yup.string().nullable()
    .url('آدرس کانونیکال باید معتبر باشد'),
  isIndexed: Yup.boolean(),
  isFollowed: Yup.boolean(),
});

const initialValues = {
  name: '',
  description: '',
  order: 0,
  slug: '',
  parentId: null as string | null,
  displayOnHomePage: false,
  orderOnHomePage: 0,
  seoTitle: '',
  metaDescription: '',
  isIndexed: true,
  isFollowed: true,
  canonicalUrl: null as string | null,
};

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, onCancel, categoryId }) => {
  const [addCategory] = useAddCategoryMutation();
  const [editCategory] = useEditCategoryMutation();
  const [getMediaById] = useGetMediaByIdMutation();
  const { data: parentCategories } = useGetParentCategoriesQuery();
  const { data: categoryData, isLoading } = useGetCategoryByIdQuery(categoryId || '', { skip: !categoryId });
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
  const formikRef = useRef<FormikContextType<typeof initialValues>>(null);
  const { selectedFiles, removeFile, clearAllFiles, addFile } = useMedia();

  const handleAddFile = useCallback((file: MediaFile, groupId: string) => {
    addFile(file, groupId);
  }, [addFile]);

  useEffect(() => {
    clearAllFiles();
  }, []);

  useEffect(() => {
    if (categoryData && formikRef.current) {
      formikRef.current.setValues({
        name: categoryData.data.name,
        description: categoryData.data.description || '',
        order: categoryData.data.order,
        slug: categoryData.data.slug,
        parentId: categoryData.data.parentId,
        displayOnHomePage: categoryData.data.displayOnHomePage,
        orderOnHomePage: categoryData.data.orderOnHomePage,
        seoTitle: categoryData.data.seoTitle || '',
        metaDescription: categoryData.data.metaDescription || '',
        isIndexed: categoryData.data.isIndexed,
        isFollowed: categoryData.data.isFollowed,
        canonicalUrl: categoryData.data.canonicalUrl,
      });

      if (categoryData.data.medias) {
        const fetchMediaDetails = async () => {
          try {
            const mediaDetails = await Promise.all(
              categoryData.data.medias.map(async (media:Media) => {
                const result = await getMediaById(media.mediaId).unwrap();
                return result.data;
              })
            );
            categoryData.data.medias.forEach((media:Media, index:number) => {
              const mediaDetail = mediaDetails[index];
              if (mediaDetail) {
                const thumbnail = mediaDetail.formats.find((f: MediaFormat) => f.format === 'thumbnail');
                handleAddFile({
                  id: media.mediaId,
                  url: thumbnail ? `${import.meta.env.VITE_MEDIA_STORAGE_URL}/${thumbnail.filePath}` : '',
                  filePath: thumbnail ? thumbnail.filePath : '',
                  groupId: media.isPrimary ? 'medias' : 'home-image',
                  isSelected: true,
                  altText: media.altText || '',
                  caption: media.caption || '',
                  title: media.title || ''
                }, media.isPrimary ? 'medias' : 'home-image');
              }
            });
          } catch (error) {
            console.error('Error fetching media details:', error);
          }
        };

        fetchMediaDetails();
      }
    }
  }, [categoryData, getMediaById]);

  const handleShowMediaGallery = (groupId: string) => {
    setShowMediaGallery(true);
    setGroupId(groupId);
  }

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>) => {
    try {
      const request: AddCategoryRequest = {
        ...(categoryId && { id: categoryId }),
        name: values.name,
        slug: values.slug,
        parentId: values.parentId,
        description: values.description,
        order: values.order,
        displayOnHomePage: values.displayOnHomePage,
        orderOnHomePage: values.displayOnHomePage ? values.orderOnHomePage : 0,
        seoTitle: values.seoTitle,
        metaDescription: values.metaDescription,
        isIndexed: values.isIndexed,
        isFollowed: values.isFollowed,
        canonicalUrl: values.canonicalUrl,
        medias: []
      }

      selectedFiles
        .filter(file => file.groupId === 'medias' && file.isSelected)
        .forEach(media => {
          request.medias.push({
            mediaId: media.id,
            isPrimary: true,
            altText: media.altText,
            caption: media.caption,
            title: media.title
          });
        });

      selectedFiles
        .filter(file => file.groupId === 'home-image' && file.isSelected)
        .forEach(media => {
          request.medias.push({
            mediaId: media.id,
            isPrimary: false,
            altText: media.altText,
            caption: media.caption,
            title: media.title
          });
        });

      if (categoryId) {
        await editCategory(request).unwrap();
      } else {
        await addCategory(request).unwrap();
      }

      clearAllFiles();
      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => {
          return (
            <Form className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'general'
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    اطلاعات کلی
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'seo'
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    اطلاعات سئو
                  </button>
                </nav>
              </div>

              {activeTab === 'general' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">نام دسته</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="نام دسته را وارد کنید"
                        onChange={(e) => setFieldValue('name', e.target.value)}
                        value={values.name}
                        error={!!(errors.name && touched.name)}
                        hint={errors.name && touched.name ? errors.name : ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">نامک</Label>
                      <Input
                        type="text"
                        id="slug"
                        name="slug"
                        placeholder="اسلاگ را وارد کنید"
                        onChange={(e) => setFieldValue('slug', e.target.value)}
                        value={values.slug}
                        error={!!(errors.slug && touched.slug)}
                        hint={errors.slug && touched.slug ? errors.slug : ''}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">توضیحات</Label>
                    <TextArea
                      value={values.description}
                      placeholder='توضیحات را وارد کنید'
                      onChange={(value) => setFieldValue('description', value)}
                      rows={3}
                      error={!!(errors.description && touched.description)}
                      hint={errors.description && touched.description ? errors.description : ''}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="order">ترتیب</Label>
                      <Input
                        type="number"
                        id="order"
                        name="order"
                        placeholder="ترتیب را وارد کنید"
                        onChange={(e) => setFieldValue('order', e.target.value)}
                        value={values.order}
                        error={!!(errors.order && touched.order)}
                        hint={errors.order && touched.order ? errors.order : ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="parentId">دسته مادر</Label>
                      <Select
                        options={[
                          { value: '', label: 'بدون دسته مادر' },
                          ...(parentCategories?.data || [])
                        ]}
                        placeholder="دسته مادر را انتخاب کنید"
                        onChange={(value) => setFieldValue('parentId', value)}
                        defaultValue={values.parentId}
                        className={errors.parentId && touched.parentId ? 'border-danger' : ''}
                      />
                      {errors.parentId && touched.parentId && (
                        <div className="text-danger mt-1">{errors.parentId}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Checkbox
                        label="نمایش در صفحه اصلی"
                        checked={values.displayOnHomePage}
                        onChange={(checked) => setFieldValue('displayOnHomePage', checked)}
                      />
                    </div>

                    {values.displayOnHomePage && (
                      <div>
                        <Label htmlFor="orderOnHomePage">ترتیب نمایش در صفحه اصلی</Label>
                        <Input
                          type="number"
                          id="orderOnHomePage"
                          name="orderOnHomePage"
                          placeholder="ترتیب نمایش در صفحه اصلی را وارد کنید"
                          onChange={(e) => setFieldValue('orderOnHomePage', e.target.value)}
                          value={values.orderOnHomePage}
                          error={!!(errors.orderOnHomePage && touched.orderOnHomePage)}
                          hint={errors.orderOnHomePage && touched.orderOnHomePage ? errors.orderOnHomePage : ''}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="media">یک تصویر برای این دسته در صفحه اصلی انتخاب کنید:</Label>
                      <button
                        type="button"
                        onClick={() => handleShowMediaGallery("home-image")}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                      >
                        انتخاب تصویر
                      </button>
                    </div>
                    {selectedFiles.filter(file => file.groupId === 'home-image' && file.isSelected).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.filter(file => file.groupId === 'home-image' && file.isSelected).map((file) => (
                          <div key={file.id} className="relative group">
                            <img
                              src={file.url}
                              alt={file.altText || ''}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => removeFile(file.id, file.groupId)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {file.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                                {file.title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className='mt-6'>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="medias">یک تصویر شاخص انتخاب کنید:</Label>
                      <button
                        type="button"
                        onClick={() => handleShowMediaGallery("medias")}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                      >
                        انتخاب تصویر
                      </button>
                    </div>
                    {selectedFiles.filter(file => file.groupId === 'medias' && file.isSelected).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.filter(file => file.groupId === 'medias' && file.isSelected).map((file) => (
                          <div key={file.id} className="relative group">
                            <img
                              src={file.url}
                              alt={file.altText || ''}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => removeFile(file.id, file.groupId)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {file.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                                {file.title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'seo' && (
                <SeoForm
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                />
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {showMediaGallery && (
        <MediaGalleryModal
          show={showMediaGallery}
          onClose={() => setShowMediaGallery(false)}
          multiple={false}
          groupId={groupId}
        />
      )}
    </>
  );
};

export default CategoryForm;