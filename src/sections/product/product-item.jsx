import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

import { useCheckoutContext } from '../checkout/context';
import { colorMap } from 'src/components/color-utils/color-picker';
import {toast} from "../../components/snackbar";
import {useState} from "react";
export function ProductItem({ product }) {
  const checkout = useCheckoutContext();
  const [selectedVariation, setSelectedVariation] = useState(() => {
    const variations = product.variations || [];
    const randomIndex = Math.floor(Math.random() * variations.length);
    return variations[randomIndex];
  });

  const {
    name, // Use the translated name
    defaultImage, // Use the primary image field
    price,
    priceSale,
    newLabel,
    saleLabel,
    variations,
    isActive,
    slug
  } = product;

  const linkTo = paths.products.details(slug);

  const handleAddCart = async () => {

    const newProduct = {
      id: `${slug}-${selectedVariation.colorCode}-${selectedVariation?.size}`,
      name: selectedVariation.name, // Use the translated name
      available: isActive, // Assuming availability is true; update if needed
      price: selectedVariation.price,
      colors: [selectedVariation.colorCode], // Default to the first variation
      size: selectedVariation?.size, // Update with actual size if applicable
      quantity: 1,
      variation: selectedVariation,
      subTotal: selectedVariation.price * 1,
      coverUrl: selectedVariation.images?.[0] || defaultImage
    };
    try {
      checkout.onAddToCart(newProduct);
      toast.success(`${name}, 1 бр. беше добавена в количката`)
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (newLabel?.enabled || saleLabel?.enabled) && (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        position: 'absolute',
        zIndex: 9,
        top: 16,
        right: 16,
      }}
    >
      {newLabel?.enabled && (
        <Label variant="filled" color="info">
          {newLabel.content}
        </Label>
      )}
      {saleLabel?.enabled && (
        <Label variant="filled" color="error">
          {saleLabel.content}
        </Label>
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      <Fab
        color="warning"
        size="medium"
        className="add-cart-btn"
        onClick={handleAddCart}
        sx={{
          right: 16,
          bottom: 16,
          zIndex: 9,
          opacity: 0,
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        <Iconify icon="solar:cart-plus-bold" width={24} />
      </Fab>

      <Tooltip title="Добави" placement="bottom-end">
        <Image
          alt={name} // Alt text as the translated name
          src={selectedVariation.images[0]} // Use the default image field
          ratio="1/1"
          sx={{ borderRadius: 1.5 }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
        {name} {/* Show the translated name */}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Safe mapping of color names to HEX */}
        <ColorPreview
          colors={variations
            ?.filter((variation) => !!variation?.colorNameTranslated) // Filter valid variations
            ?.map((variation) => {
              const color = colorMap[variation.colorNameTranslated];
              if (!color) {
                console.warn(`Missing color in colorMap for: ${variation.colorNameTranslated}`);
              }
              return color || '#CCCCCC'; // Fallback to default gray
            })}
        />

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {priceSale && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(priceSale)}
            </Box>
          )}

          <Box component="span">{fCurrency(price)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}

