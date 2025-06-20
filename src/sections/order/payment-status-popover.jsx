import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {Iconify} from "../../components/iconify";
import { CustomPopover } from 'src/components/custom-popover';

export function PaymentStatusPopover({ open, anchorEl, onClose, onSelect }) {
  return (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{ arrow: { placement: 'top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => { onSelect(true); onClose(); }}>
          <Iconify icon="solar:check-circle-bold" width={20} sx={{ mr: 1 }} />
          Платено
        </MenuItem>
        <MenuItem onClick={() => { onSelect(false); onClose(); }}>
          <Iconify icon="solar:close-circle-bold" width={20} sx={{ mr: 1 }} />
          НЕ Платено
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );
}
