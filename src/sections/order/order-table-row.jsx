import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {useTranslate} from "../../locales";
import {getOrderStatusColor} from "../../utils/helper";

// ----------------------------------------------------------------------

export function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const {t: tCommon} = useTranslate('common');
  const {t: tOrder} = useTranslate('order');

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row._id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {row.orderId}
        </Link>
      </TableCell>

      <TableCell>
        <Stack spacing={0.5} alignItems="flex-start">
          <Box component="span">{row.recipient}</Box>
          <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
            {row.phoneNumber}
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.createdAt)}
          secondary={fTime(row.createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell align="center">{row.totalItems}</TableCell>

      <TableCell>{fCurrency(row.total)}</TableCell>
      <TableCell>
        <Label
          variant="soft">
          {tOrder(`table.${row.paymentType}`)}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={getOrderStatusColor(row.orderStatus)}
        >
          {tOrder(`table.${row.orderStatus}`)}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={9}>
        <Collapse in={collapse.value} timeout="auto" unmountOnExit sx={{ bgcolor: 'background.neutral' }}>
          <Paper sx={{ m: 1.5 }}>
            {row.items.map((item) => (
              <Stack
                key={item._id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  },
                }}
              >
                <Avatar src={item.coverUrl} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

                <ListItemText
                  primary={item.name}
                  secondary={`Size: ${item.size}`}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{ component: 'span', color: 'text.disabled', typography: 'caption' }}
                />

                <Box sx={{ mx: 2 }}>x{item.quantity}</Box>

                <Box sx={{ ml: 'auto' }}>{fCurrency(item.price)}</Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>


          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            {tCommon('buttons.view')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {tCommon('buttons.delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={tCommon('buttons.delete')}
        content="Are you sure want to delete?"
        action={<Button variant="contained" color="error" onClick={onDeleteRow}>Delete</Button>}
      />
    </>
  );
}
