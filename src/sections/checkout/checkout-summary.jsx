import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CheckoutSummary({ total, onEdit, discount, subtotal, shipping, onApplyDiscount }) {
  const displayShipping = shipping !== null ? 'За ваша сметка' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Описание на поръчката"
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Промени
            </Button>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Сума
          </Typography>
          <Typography component="span" variant="subtitle2">
            {fCurrency(subtotal)}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Отстъпка
          </Typography>
          <Typography component="span" variant="subtitle2">
            {discount ? fCurrency(-discount) : '-'}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Доставка
          </Typography>
          <Typography component="span" variant="subtitle2">
            {shipping ? fCurrency(shipping) : displayShipping}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box display="flex">
          <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Общо
          </Typography>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ display: 'block', color: 'error.main' }}
            >
              {fCurrency(total)}
            </Typography>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              (Сумата е с включено ДДС)
            </Typography>
          </Box>
        </Box>

        {/*Todo: 2. Add discount*/}

        {/*{onApplyDiscount && (
          <TextField
            fullWidth
            placeholder="Discount codes / Gifts"
            value="DISCOUNT5"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                    Добави
                  </Button>
                </InputAdornment>
              )
            }}
          />
        )}*/}
      </Stack>
    </Card>
  );
}
