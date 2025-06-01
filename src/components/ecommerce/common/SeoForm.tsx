import React from 'react';
import Input from '../../../components/form/input/InputField';
import TextArea from '../../../components/form/input/TextArea';
import Checkbox from '../../../components/form/input/Checkbox';
import Label from '../../form/Label';

interface SeoFormProps {
  values: {
    seoTitle: string;
    metaDescription: string;
    canonicalUrl: string | null;
    isIndexed: boolean;
    isFollowed: boolean;
  };
  errors: {
    seoTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  touched: {
    seoTitle?: boolean;
    metaDescription?: boolean;
    canonicalUrl?: boolean;
  };
  setFieldValue: (field: string, value: string | boolean | null) => void;
}

const SeoForm: React.FC<SeoFormProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="seoTitle">عنوان سئو</Label>
                <Input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    placeholder="عنوان سئو را وارد کنید"
                    onChange={(e) => setFieldValue('seoTitle', e.target.value)}
                    value={values.seoTitle}
                    error={!!(errors.seoTitle && touched.seoTitle)}
                    hint={errors.seoTitle && touched.seoTitle ? errors.seoTitle : ''}
                />
            </div>

            <div>
                <Label htmlFor="metaDescription">توضیحات متا</Label>
                <TextArea
                    value={values.metaDescription}
                    placeholder='توضیحات متا را وارد کنید'
                    onChange={(value) => setFieldValue('metaDescription', value)}
                    rows={3}
                    error={!!(errors.metaDescription && touched.metaDescription)}
                    hint={errors.metaDescription && touched.metaDescription ? errors.metaDescription : ''}
                />
            </div>

            <div>
                <Label htmlFor="canonicalUrl">آدرس کانونیکال</Label>
                <Input
                    type="text"
                    id="canonicalUrl"
                    name="canonicalUrl"
                    placeholder="آدرس کانونیکال را وارد کنید"
                    onChange={(e) => setFieldValue('canonicalUrl', e.target.value || null)}
                    value={values.canonicalUrl || ''}
                    error={!!(errors.canonicalUrl && touched.canonicalUrl)}
                    hint={errors.canonicalUrl && touched.canonicalUrl ? errors.canonicalUrl : ''}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Checkbox
                        label="ایندکس شود"
                        checked={values.isIndexed}
                        onChange={(checked) => setFieldValue('isIndexed', checked)}
                    />
                </div>
                <div>
                    <Checkbox
                        label="فالو شود"
                        checked={values.isFollowed}
                        onChange={(checked) => setFieldValue('isFollowed', checked)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SeoForm;