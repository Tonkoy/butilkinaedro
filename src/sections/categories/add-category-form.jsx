import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

import {
  Box,
  MenuItem,
  Stack,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form, Field } from 'src/components/hook-form';
import { endpoints } from '../../utils/axios';
import {useTranslate} from "src/locales";
import {toast} from "src/components/snackbar";

const CategoryForm = ({ editable, categories, initialValues, afterCreate }) => {

  const { t: tCategory } = useTranslate('category');
  const { t: tCommon } = useTranslate('common');

  const CategorySchema = z.object({
    parentCategory: z.string().nullable().optional(),
    src: z.string().optional(),
    name: z.string().min(2, tCommon('errors.minLength', { 0: 2 })).max(50, tCommon('errors.maxLength', { 0: 50 })),
    description: z.string().min(2, tCommon('errors.minLength', { 0: 2 })),
    slug: z.string({ required_error: tCommon('errors.required') }),
    key: z.string({ required_error: tCommon('errors.required') }),
    status: z.boolean({ required_error: tCommon('errors.required') }),
    seoTitle: z.string().min(2, tCommon('errors.minLength', { 0: 2 })).max(100, tCommon('errors.maxLength', { 0: 100 })),
    seoDescription: z.string().min(2, tCommon('errors.minLength', { 0: 2 })).max(800, tCommon('errors.maxLength', { 0: 800 })),
    seoKeywords: z.string({ required_error: tCommon('errors.required') }),
    ogImageUrl: z.string({ required_error: tCommon('errors.required') }),
  });

  const defaultValues = {
    parentCategory: null,
    src: '',
    name: '',
    description: '',
    slug: '',
    key: '',
    status: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImageUrl: '',
  };

  const methods = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialValues || defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  console.log(isValid)

  useEffect(() => {
    reset(initialValues || defaultValues);
  }, [initialValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.parentCategory) data.parentCategory = null;

      const res = editable
        ? await axios.put(endpoints.categories.list, { _id: initialValues?._id, ...data })
        : await axios.post(endpoints.categories.list, data);


      if (res.status === 200 || res.status === 201) {
        afterCreate();
        reset(defaultValues);
        toast.success(editable ? tCategory('notifications.updateSuccess') : tCategory('notifications.createSuccess'));
      }
    } catch (error) {
      console.error(error);
      toast.error(editable ? tCategory('notifications.updateError') : tCategory('notifications.createError'));
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              {categories?.length > 0 && (
                <Field.Select name="parentCategory" label={tCategory('formFields.parentCategory')}>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}
              <Field.Select name="status" label={tCategory('formFields.status')}>
                <MenuItem value={true}>{tCommon('buttons.yes')}</MenuItem>
                <MenuItem value={false}>{tCommon('buttons.no')}</MenuItem>
              </Field.Select>
              <Field.Text name="name" label={tCategory('formFields.name')} />
              <Field.Text name="description" label={tCategory('formFields.description')} multiline rows={3} />
              <Field.Text name="src" label={tCategory('formFields.image')} />
              <Field.Text name="slug" label={tCategory('formFields.slug')} />
              <Field.Text name="key" label={tCategory('formFields.key')} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="seoTitle" label={tCategory('formFields.seoTitle')} />
              <Field.Text name="seoDescription" label={tCategory('formFields.seoDescription')} multiline rows={3} />
              <Field.Text name="seoKeywords" label={tCategory('formFields.seoKeywords')} />
              <Field.Text name="ogImageUrl" label={tCategory('formFields.ogImageUrl')} />
            </Box>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', p: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isValid} >
            {editable ? tCommon('buttons.save') : tCommon('buttons.submit')}
          </LoadingButton>
        </CardActions>
      </Card>
    </Form>
  );
};

export default CategoryForm;
