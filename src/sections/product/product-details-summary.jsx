import { useEffect, useCallback, useMemo, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, RHFSelect } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

import { IncrementerButton } from './components/incrementer-button';
import {toast} from "src/components/snackbar";

// ----------------------------------------------------------------------

function calculateAvailableStock(variation, items) {
  if (!variation) return 0;

  // Safely handle if variation.stock is undefined or 0
  const variationStock = variation.stock ?? 0;
  if (variationStock <= 0) {
    return 0;
  }

  const quantityInBasket =
    items
      ?.filter(
        (item) =>
          item.variation?.colorCode === variation.colorCode &&
          item.variation?.size === variation.size
      )
      .reduce((sum, cur) => sum + cur.quantity, 0) || 0;

  return Math.max(variationStock - quantityInBasket, 0);
}


export function ProductDetailsSummary({
                                        items,
                                        product,
                                        onAddCart,
                                        onGotoStep,
                                        disableActions,
                                        ...other
                                      }) {
  const router = useRouter();

  const {
    id,
    name,
    price,
    coverUrl,
    newLabel,
    available,
    priceSale,
    saleLabel,
    inventoryType,
    subDescription,
    variations,
    slug,
    isActive,
    dimensions
  } = product;

  // Default to first variation
  const [selectedVariation, setSelectedVariation] = useState(variations?.[0] || null);

  // form setup
  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    colors: variations?.[0]?.colorCode || '',
    size: variations?.[0]?.size || '',
    quantity: variations?.[0]?.stock > 0 ? 1 : 0,
  };


  const methods = useForm({
    defaultValues,
  });
  const { reset, control, setValue, handleSubmit, getValues } = methods;

  // Whenever the product changes, reset the form to default values
  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Watch for changes from the form
  const watchColors = useWatch({ control, name: 'colors' });
  const watchSize = useWatch({ control, name: 'size' });
  const watchQuantity = useWatch({ control, name: 'quantity' });

  // Re-compute the currently selected variation whenever color/size changes
  useEffect(() => {
    const variationMatch = variations.find(
      (v) => v.colorCode === watchColors && v.size === watchSize
    );

    // If we find a direct match for color+size, pick it;
    // else fallback to first that matches color or size alone
    if (variationMatch) {
      setSelectedVariation(variationMatch);
      // If stock changed, also adjust quantity if needed
      if (variationMatch.stock < watchQuantity) {
        setValue('quantity', variationMatch.stock > 0 ? 1 : 0);
      }
    } else {
      // fallback logic
      const fallbackByColor = variations.find((v) => v.colorCode === watchColors);
      const fallbackBySize = variations.find((v) => v.size === watchSize);

      const fallback = fallbackByColor || fallbackBySize || variations[0];
      if (fallback) {
        setSelectedVariation(fallback);
        setValue('colors', fallback.colorCode);
        setValue('size', fallback.size);
        setValue('quantity', fallback.stock > 0 ? 1 : 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchColors, watchSize]);

  // Compute how many are available for the currently selected variation
  const availableStock = useMemo(() => {
    return calculateAvailableStock(selectedVariation, items);
  }, [selectedVariation, items]);

  // Whether user has reached the max quantity for this variation
  const isMaxQuantity = watchQuantity >= availableStock;

  /**
   * handleSubmit for the "Buy Now" workflow if you are specifically
   * using <Form onSubmit={onSubmit} />. In many flows, though,
   * you might skip the explicit onSubmit in favor of a direct “Buy Now” button.
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      onGotoStep?.(0);
      router.push(paths.products.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * Add to cart or buy now. We always read the fresh quantity (and color/size)
   * from getValues(), so we’re never stuck with stale data.
   */
  const handleAddCart = useCallback(
    (buyNow) => {
      try {
        const { quantity, colors, size } = getValues();

        const newProduct = {
          id: `${slug}-${selectedVariation.colorCode}-${selectedVariation.size}`,
          name,
          colors: [colors],
          size,
          quantity,
          subTotal: selectedVariation.price * quantity,
          price: selectedVariation.price,
          available: isActive,
          coverUrl: selectedVariation.images?.[0] || coverUrl,
          variation: selectedVariation,
        };
        toast.success(`${name}, ${quantity} бр. беше добавена в количката`, )
        onAddCart?.(newProduct);
        if (buyNow) {
          router.push(paths.products.checkout);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      getValues,
      onAddCart,
      router,
      slug,
      name,
      coverUrl,
      isActive,
      selectedVariation,
    ]
  );

  // Price rendering
  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {priceSale && (
        <Box
          component="span"
          sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
        >
          {fCurrency(priceSale)}
        </Box>
      )}
      {fCurrency(selectedVariation?.price)}
    </Box>
  );

  // Color selection
  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Цвят
      </Typography>
      <Controller
        name="colors"
        control={control}
        render={({ field }) => {
          // Filter only the colors available for the currently selected size
          const colorsForSelectedSize = variations
            .filter((v) => v.size === watchSize)
            .map((v) => v.colorCode);
          return (
            <ColorPicker
              colors={colorsForSelectedSize}
              selected={field.value}
              onSelectColor={(color) => field.onChange(color)}
              limit={4}
            />
          );
        }}
      />
    </Stack>
  );

  // Size selection
  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Размер
      </Typography>
      <RHFSelect
        name="size"
        size="small"
        helperText={
           <Link underline="always" color="textPrimary">
             { dimensions[0] }
          </Link>
        }
        sx={{
          maxWidth: 88,
          [`& .${formHelperTextClasses.root}`]: {
            mx: 0,
            mt: 1,
            textAlign: 'right',
          },
        }}
      >
        {/** Filter only the sizes available for the currently selected color */}
        {variations
          .filter((v) => v.colorCode === watchColors)
          .map((v) => v.size)
          .map((sizeOption) => (
            <MenuItem key={sizeOption} value={sizeOption}>
              {sizeOption}
            </MenuItem>
          ))}
      </RHFSelect>
    </Stack>
  );

  // Quantity picker
  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Количество
      </Typography>
      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={watchQuantity}
          disabledDecrease={watchQuantity <= 1}
          disabledIncrease={isMaxQuantity}
          onIncrease={() =>
            setValue('quantity', Math.min(watchQuantity + 1, availableStock))
          }
          onDecrease={() => setValue('quantity', watchQuantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Налични: {availableStock}
        </Typography>
      </Stack>
    </Stack>
  );

  // Action buttons
  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={() => handleAddCart(false)}
        disabled={
          availableStock <= 0 ||
          watchQuantity < 1 ||
          watchQuantity > availableStock
        }
        sx={{ whiteSpace: 'nowrap' }}
      >
        Добави в количката
      </Button>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={() => handleAddCart(true)}
        disabled={
          availableStock <= 0 ||
          watchQuantity < 1 ||
          watchQuantity > availableStock
        }
      >
        Купи веднага
      </Button>
    </Stack>
  );

  // Optional sub-description
  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  // Optional product labels, e.g. "New" or "Sale"
  const renderLabels =
    (newLabel?.enabled || saleLabel?.enabled) && (
      <Stack direction="row" alignItems="center" spacing={1}>
        {newLabel?.enabled && <Label color="info">{newLabel.content}</Label>}
        {saleLabel?.enabled && <Label color="error">{saleLabel.content}</Label>}
      </Stack>
    );

  // Inventory type text, e.g. "out of stock", "low stock", etc.
  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}
          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>
          {renderPrice}
          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderColorOptions}
        {renderSizeOptions}
        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}
      </Stack>
    </Form>
  );
}
