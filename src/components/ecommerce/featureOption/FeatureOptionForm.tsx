import * as Yup from 'yup';
import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, FormikContextType, FormikHelpers } from 'formik';
import Label from '../../form/Label';
import Input from '../../form/input/InputField';
import LoadingSpinner from '../../common/LoadingSpinner';
import TextArea from '../../../components/form/input/TextArea';
import { useGetFeatureOptionByIdQuery } from '../../../api/featureOptionApi';
import { useEditFeatureOptionMutation } from '../../../api/featureOptionApi';
import { useAddFeatureOptionMutation } from '../../../api/featureOptionApi';
import { AddFeatureOptionRequest } from '../../../types/featureOption';

interface FeatureOptionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  featureOptionId?: string;
  featureId?: string | null;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('نام دسته الزامی است')
    .min(2, 'نام دسته باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام دسته نمی‌تواند بیشتر از 50 کاراکتر باشد'),
  slug: Yup.string()
    .required('اسلاگ الزامی است')
    .matches(/^[a-z0-9-]+$/, 'اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد'),
});

const initialValues = {
  name: '',
  slug: '',
  order:0,
  description:'',
};

const FeatureOptionForm: React.FC<FeatureOptionFormProps> = ({ onSuccess, onCancel, featureOptionId, featureId }) => {
  const [addFeatureOption] = useAddFeatureOptionMutation();
  const [editFeatureOption] = useEditFeatureOptionMutation();
  const { data: featureOptionData, isLoading } = useGetFeatureOptionByIdQuery(featureOptionId || '', { skip: !featureOptionId });
  const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
  const formikRef = useRef<FormikContextType<typeof initialValues>>(null);

  console.log(featureId)

  useEffect(() => {
    if (featureOptionData && formikRef.current) {
      formikRef.current.setValues({
        name: featureOptionData.data.name,
        slug: featureOptionData.data.slug,
        order: featureOptionData.data.order,
        description: featureOptionData.data.description
      });
    }
  }, [featureOptionData]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>) => {
    try {
      const request: AddFeatureOptionRequest = {
        ...(featureOptionId && { id: featureOptionId }),
        name: values.name,
        slug: values.slug,
        order:values.order,
        description:values.description,
        featureId:featureId || null,
      }
      
      console.log(request)
      if (featureOptionId) {
        await editFeatureOption(request).unwrap();
      } else {
        await addFeatureOption(request).unwrap();
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
                      <Label htmlFor="name">نام گزینه</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="نام گزینه را وارد کنید"
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

export default FeatureOptionForm;