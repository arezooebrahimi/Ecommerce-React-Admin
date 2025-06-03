import * as Yup from 'yup';
import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, FormikContextType, FormikHelpers } from 'formik';
import { useGetMediaByIdMutation } from '../../../api/mediaApi';
import Label from '../../form/Label';
import Input from '../../form/input/InputField';
import TextArea from '../../form/input/TextArea';
import LoadingSpinner from '../../common/LoadingSpinner';
import { useAddProductReviewMutation, useEditProductReviewMutation, useGetProductReviewByIdQuery } from '../../../api/productReviewApi';
import { AddProductReviewRequest } from '../../../types/productReview';

interface ProductReviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  productReviewId?: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('نام محصول الزامی است')
    .min(2, 'نام محصول باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام محصول نمی‌تواند بیشتر از 50 کاراکتر باشد'),
  reviewText: Yup.string()
    .max(500, 'توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد'),
  rating: Yup.number()
    .required('امتیاز الزامی است')
    .min(1, 'امتیاز باید حداقل 1 باشد')
    .max(5, 'امتیاز باید حداکثر 5 باشد'),
});

const initialValues = {
  title: '',
  reviewText: '',
  rating: 0,
  productId: '',
};

const ProductReviewForm: React.FC<ProductReviewFormProps> = ({ onSuccess, onCancel, productReviewId }) => {
  const [addProductReview] = useAddProductReviewMutation();
  const [editProductReview] = useEditProductReviewMutation();
  const [getMediaById] = useGetMediaByIdMutation();
  const { data: productReviewData, isLoading } = useGetProductReviewByIdQuery(productReviewId || '', { skip: !productReviewId });
  const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
  const formikRef = useRef<FormikContextType<typeof initialValues>>(null);

  useEffect(() => {
    if (productReviewData && formikRef.current) {
      formikRef.current.setValues({
        title: productReviewData.data.title,
        reviewText: productReviewData.data.reviewText,
        rating: productReviewData.data.rating,
        productId: productReviewData.data.productId
      });
    }
  }, [productReviewData, getMediaById]);


  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>) => {
    try {
      const request: AddProductReviewRequest = {
        ...(productReviewId && { id: productReviewId }),
        title: values.title,
        reviewText: values.reviewText,
        rating: values.rating,
        productId: values.productId,
      }

      if (productReviewId) {
        await editProductReview(request).unwrap();
      } else {
        await addProductReview(request).unwrap();
      }

      onSuccess?.();
      resetForm();
    } catch (error) {
      console.error('Error saving product review:', error);
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
                      <Label htmlFor="title">عنوان</Label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="عنوان را وارد کنید"
                        onChange={(e) => setFieldValue('title', e.target.value)}
                        value={values.title}
                        error={!!(errors.title && touched.title)}
                        hint={errors.title && touched.title ? errors.title : ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="reviewText">متن دیدگاه</Label>
                      <TextArea
                        value={values.reviewText}
                        placeholder="متن دیدگاه را وارد کنید"
                        onChange={(value) => setFieldValue('reviewText', value)}
                        rows={3}
                        error={!!(errors.reviewText && touched.reviewText)}
                        hint={errors.reviewText && touched.reviewText ? errors.reviewText : ''}
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">امتیاز</Label>
                      <Input
                        type="number"
                        id="rating"
                        name="rating"
                        placeholder="امتیاز را وارد کنید"
                        onChange={(e) => setFieldValue('rating', e.target.value)}
                        value={values.rating}
                        error={!!(errors.rating && touched.rating)}
                        hint={errors.rating && touched.rating ? errors.rating : ''}
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

export default ProductReviewForm;