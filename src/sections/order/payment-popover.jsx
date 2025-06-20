import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import {Iconify} from "../../components/iconify";
import { CustomPopover } from 'src/components/custom-popover';
import { PAYMENT_TYPE_OPTIONS } from 'src/utils/helper';

export function PaymentTypePopover({ open, anchorEl, onClose, onSelect }) {
  return (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{ arrow: { placement: 'top' } }}
    >
      <MenuList>
        {PAYMENT_TYPE_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            <Iconify icon={option.icon} width={20} sx={{ mr: 1 }} />
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );
}
