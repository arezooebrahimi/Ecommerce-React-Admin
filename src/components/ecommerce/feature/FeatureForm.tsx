import * as Yup from 'yup';
import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, FormikContextType, FormikHelpers } from 'formik';
import { useAddFeatureMutation, useGetFeatureByIdQuery } from '../../../api/featureApi';
import { useEditFeatureMutation } from '../../../api/featureApi';
import { AddFeatureRequest } from '../../../types/feature';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Checkbox from '../../../components/form/input/Checkbox';

interface FeatureFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  featureId?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('نام ویژگی الزامی است')
    .min(2, 'نام ویژگی باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام ویژگی نمی‌تواند بیشتر از 50 کاراکتر باشد'),
  slug: Yup.string()
    .required('اسلاگ الزامی است')
    .matches(/^[a-z0-9-]+$/, 'اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد'),
  isFilter: Yup.boolean()
});

const initialValues = {
  name: '',
  slug: '',
  isFilter: false
};

const FeatureForm: React.FC<FeatureFormProps> = ({ onSuccess, onCancel, featureId }) => {
  const [addFeature] = useAddFeatureMutation();
  const [editFeature] = useEditFeatureMutation();
  // const { data: parentCategories } = useGetParentCategoriesQuery();
  const { data: featureData, isLoading } = useGetFeatureByIdQuery(featureId || '', { skip: !featureId });
  const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
  const formikRef = useRef<FormikContextType<typeof initialValues>>(null);

  useEffect(() => {
    if (featureData && formikRef.current) {
      formikRef.current.setValues({
        name: featureData.data.name,
        slug: featureData.data.slug,
        isFilter: featureData.data.isFilter
      });
    }
  }, [featureData]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>) => {
    try {
      const request: AddFeatureRequest = {
        ...(featureId && { id: featureId }),
        name: values.name,
        slug: values.slug,
        isFilter: values.isFilter
      }

      console.log(request);
      if (featureId) {
        await editFeature(request).unwrap();
      } else {
        await addFeature(request).unwrap();
      }
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
                </nav>
              </div>

              {activeTab === 'general' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">نام ویژگی</Label>
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
                        placeholder="نامک را وارد کنید"
                        onChange={(e) => setFieldValue('slug', e.target.value)}
                        value={values.slug}
                        error={!!(errors.slug && touched.slug)}
                        hint={errors.slug && touched.slug ? errors.slug : ''}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Checkbox
                      label="فیلتر هست؟"
                      checked={values.isFilter}
                      onChange={(checked) => setFieldValue('isFilter', checked)}
                    />
                  </div>
                </>
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
    </>
  );
};

export default FeatureForm;