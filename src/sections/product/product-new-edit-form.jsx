import { z as zod } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails, MenuItem,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  _tags,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import Button from "@mui/material/Button";
import { uploadImage } from "../../actions/image";
import {Iconify} from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import {useTranslate} from "../../locales";
import {createProduct, updateProductAndSync} from "../../actions/product";

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  seoTitle: zod.string().min(1, { message: 'SEO Title is required!' }),
  seoDescription: zod.string().min(1, { message: 'SEO Description is required!' }),
  seoKeywords: zod.string().min(1, { message: 'SEO Keywords are required!' }),
  ogImageUrl: zod.string().url({ message: 'Provide a valid URL for the OG image!' }),
  slug: zod.string().min(1, { message: 'Slug is required!' }),
  key: zod.string().optional(),
  category: zod.string(),
  defaultImage: zod.string().min(1, { message: 'Main image is required!' }),
  variations: zod
    .array(
      zod.object({
        name: zod.string(),
        itemCode: zod.string().optional(),
        colorCode: zod.string().optional(),
        colorNameOriginal: zod.string().optional(),
        colorNameTranslated: zod.string().optional(),
        stock: zod.number().optional(),
        price: zod.number().min(0, { message: 'Price must be at least 0' }),
        moq: zod.number().optional(),
        images: zod.array(zod.string()).optional(),
        measures: zod.string().optional(),
        boxSize: zod.string().optional(),
        weight: zod.number().optional(),
        size: zod.string().optional(),
      })
    )
    .optional(),
  colors: zod
    .array(
      zod.object({
        name: zod.string(),
        hex: zod.string(),
      })
    )
    .optional(),
  price: zod.number().min(0, { message: 'Price must be at least 0!' }),
  minimumForOrder: zod.number().min(1, { message: 'Minimum order must be at least 1!' }),
  available: zod.boolean(),
  sourceUrl: zod.string().optional(),
  dimensions: zod.array(zod.string()).optional(),
  manufacturer: zod.string().optional(),
  tags: zod.array(zod.string()).optional(),
  quantity: zod.number().min(0, { message: 'Quantity must be at least 0!' }),
  active: zod.boolean(),
  modelCode: zod.string().optional(),
  nameOriginal: zod.string().optional(),
  descriptionOriginal: zod.string().optional(),
  composition: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function ProductNewEditForm({ currentProduct, categories }) {
  const router = useRouter();
  const { t: tProduct } = useTranslate('product');
  const { t: tCommon } = useTranslate('common');
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const isEditMode = Boolean(currentProduct);

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      seoTitle: currentProduct?.seoTitle || currentProduct?.name || '',
      seoDescription: currentProduct?.seoDescription || currentProduct?.description || '',
      seoKeywords: currentProduct?.seoKeywords || '',
      ogImageUrl: currentProduct?.ogImageUrl || currentProduct?.defaultImage || '',
      slug: currentProduct?.slug || '',
      key: currentProduct?.key || '',
      category: typeof currentProduct?.category === 'object' ? currentProduct.category.$oid : currentProduct?.category || '',
      defaultImage: currentProduct?.defaultImage || '',
      variations: currentProduct?.variations || [{ name: '', itemCode: '', colorCode: '', stock: 0, price: 0, moq: 1, images: [''] }], // Add default variations
      colors: currentProduct?.colors || [],
      price: currentProduct?.price || 0,
      minimumForOrder: currentProduct?.minimumForOrder || 1,
      available: currentProduct?.available || false,
      sourceUrl: currentProduct?.sourceUrl || '',
      dimensions: currentProduct?.dimensions || [],
      manufacturer: currentProduct?.manufacturer || '',
      tags: currentProduct?.tags || [],
      quantity: currentProduct?.quantity || 0,
      active: currentProduct?.active || false,
      modelCode: currentProduct?.modelCode || '',
      nameOriginal: currentProduct?.nameOriginal || '',
      descriptionOriginal: currentProduct?.descriptionOriginal || '',
      composition: currentProduct?.composition || '',
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Submitting form data:', data);
    try {
      isEditMode ? await updateProductAndSync(currentProduct?._id, data) : await createProduct(data);
      reset();
      toast.success(isEditMode ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
    } catch (error) {
      toast.error(isEditMode ? 'Грешка!' : 'Грешка!');
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('defaultImage', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('defaultImage', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderVariations = useMemo(() => <Card>
    <CardHeader title="Варианти" subheader="Менажирай вариантите (e.g., цвят, размер, цена, количества)" sx={{ mb: 3 }} />

    <Divider />

    <Stack spacing={3} sx={{ p: 3 }}>
      <FieldArray name="variations" />
    </Stack>
  </Card>, [methods.control]);


  function FieldArray({ name }) {
    const { fields, append, remove } = useFieldArray({
      control: methods.control,
      name,
    });

    const handleDuplicate = (index) => {
      const variationToDuplicate = fields[index];
      append({ ...variationToDuplicate, id: undefined });
    };

    return (
      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Accordion key={field.id} defaultExpanded={false}>
            <AccordionSummary expandIcon={<Iconify width={20} icon="eva:arrow-ios-forward-fill" />}>
              <Typography variant="subtitle1">{`${field.name}-${field.colorCode}-${field.size}` || `Вариант ${index + 1}`}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2}>
                <Field.Text
                  name={`variations.${index}.name`}
                  defaultValue={field.name?.[0] || ''}
                  placeholder="Име"
                  label="Име"
                />
                <Field.Text
                  name={`variations.${index}.images.0`}
                  defaultValue={field.images?.[0] || ''}
                  placeholder="Enter image URL"
                  label="Снимка"
                />
                <Field.Text
                  name={`variations.${index}.colorCode`}
                  defaultValue={field.colorCode || ''}
                  placeholder="e.g., #fff"
                  label="Цвят"
                />
                <Field.Text
                  name={`variations.${index}.size`}
                  defaultValue={field.size || ''}
                  placeholder="e.g., M"
                  label="Размер"
                />
                <Field.Text
                  name={`variations.${index}.price`}
                  defaultValue={field.price || 0}
                  type="number"
                  placeholder="e.g., 12.00"
                  label="Цена"
                />
                <Field.Text
                  name={`variations.${index}.discountedPrice`}
                  defaultValue={field.discountedPrice || 0}
                  type="number"
                  placeholder="e.g., 10.00"
                  label="Намалена цена"
                />
                <Field.Text
                  name={`variations.${index}.stock`}
                  defaultValue={field.stock || 0}
                  type="number"
                  placeholder="e.g., 5"
                  label="На склад"
                />
                <Field.Switch
                  name={`variations.${index}.isAvailable`}
                  defaultChecked={field.isAvailable || false}
                  label="Наличен"
                />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton size="small" onClick={() => handleDuplicate(index)}>
                    <Iconify icon="solar:copy-bold" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => remove(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
          variant="contained"
          size="large"
          onClick={() =>
            append({
              images: [''],
              colorCode: '',
              size: '',
              price: 0,
              discountedPrice: 0,
              stock: 0,
              isAvailable: true,
            })
          }
        >
          Добави вариант
        </Button>
      </Stack>
    );
  }

  const handleDropSingleFile = useCallback(async (acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      try {
        const formData = new FormData();
        formData.append('file', newFile);
        const response = await uploadImage(formData);
        console.log(response.data.url)
        setValue('defaultImage', response.data.url , { shouldValidate: true });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }, []);

  const renderDetails = (
    <Card>
      <CardHeader title="Детайли" subheader="Име, описание, снимки ...." sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label={tProduct('formFields.name')} />
        <Field.Text name="slug" label={tProduct('formFields.slug')} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{tProduct('formFields.content')}</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{tProduct('formFields.defaultImage')}</Typography>
          <Field.Upload
            thumbnail
            name="defaultImage"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onDrop={handleDropSingleFile}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title={tProduct('general.additional')}
        subheader={tProduct('general.additionalOptions')}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text name="code" label={tProduct('general.productCode')} />

          <Field.Text name="sku" label="SKU" />

          <Field.Text
            name="quantity"
            label={tProduct('formFields.quantity')}
            placeholder="0"
            type="number"
            InputLabelProps={{ shrink: true }}
          />

          {categories?.length > 0 && (
            <Field.Select name="category" label={tProduct('formFields.category')}>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Field.Select>
          )}
        </Box>

        <Field.Autocomplete
          name="tags"
          label={tProduct('formFields.tags')}
          placeholder={tCommon('buttons.add') + ' ' + tProduct('formFields.tags')}
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader title={tProduct('general.pricing')} subheader={tProduct('general.includesTaxes')} sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="price"
          label={tProduct('formFields.price')}
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
        />

        <Field.Text
          name="priceSale"
          label={tProduct('formFields.priceSale')}
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
        />

        <FormControlLabel
          control={
            <Switch id="toggle-taxes" checked={includeTaxes} onChange={handleChangeIncludeTaxes} />
          }
          label={tProduct('general.includesTaxes')}
        />

        {!includeTaxes && (
          <Field.Text
            name="taxes"
            label={tProduct('formFields.taxes')}
            placeholder="0.00"
            type="number"
            InputLabelProps={{ shrink: true }}
          />
        )}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label={tProduct('general.publish')}
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? tProduct('general.createProduct') : tProduct('general.saveChanges')}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>


        {renderDetails}

        {/* SEO Fields */}
        <Card>
          <CardHeader title="SEO Настройки" />
          <Stack spacing={2} sx={{ p: 3 }}>
            <Field.Text name="seoTitle" label={tProduct('formFields.seoTitle')} />
            <Field.Text name="seoDescription" label={tProduct('formFields.seoDescription')} multiline rows={2} />
            <Field.Text name="seoKeywords" label={tProduct('formFields.seoKeywords')} />
            <Field.Text name="ogImageUrl" label={tProduct('formFields.ogImageUrl')} />
          </Stack>
        </Card>

        {renderProperties}

        {renderVariations}

        {renderPricing}

        {renderActions}
      </Stack>
    </Form>
  );
}
