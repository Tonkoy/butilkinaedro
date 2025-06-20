import { forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha as hexAlpha } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export const colorMap = {
  BLACK: '#000000',
  black: '#000000',
  'ЧЕРНА': '#000000',
  'WHITE': '#FFFFFF',
  white: '#FFFFFF',
  'БЯЛА': '#FFFFFF',
  TRANSPARENT: 'rgba(0, 0, 0, 0)',
  transparent: 'rgba(0, 0, 0, 0)',
  'ПРОЗРАЧНА': 'rgba(0, 0, 0, 0)',
  GREEN: '#008000',
  green: '#008000',
  'ЗЕЛЕНА': '#008000',
  BLUE: '#0000FF',
  blue: '#0000FF',
  'СИНЯ': '#0000FF',
  'ROYAL BLUE': '#4169E1',
  'КРАЛСКО СИНЯ': '#4169E1',
  YELLOW: '#FFFF00',
  yellow: '#FFFF00',
  'ЖЪЛТА': '#FFFF00',
  RED: '#FF0000',
  red: '#FF0000',
  'ЧЕРВЕНА': '#FF0000',
  ORANGE: '#FFA500',
  orange: '#FFA500',
  'ОРАНЖЕВА': '#FFA500',
  GREY: '#808080',
  grey: '#808080',
  'СИВА': '#808080',
  SILVER: '#C0C0C0',
  'СРЕБЪРНА': '#C0C0C0',
};


const normalizeColor = (color) => {
  // Map known colors
  if (colorMap[color]) return colorMap[color];

  // Validate custom colors
  try {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    return div.style.backgroundColor ? color : 'transparent';
  } catch {
    return 'transparent';
  }
};
export const ColorPicker = forwardRef(
  ({ colors, selected, onSelectColor, limit = 'auto', sx, slotProps, ...other }, ref) => {
    const singleSelect = typeof selected === 'string';

    const handleSelect = useCallback(
      (color) => {
        if (singleSelect) {
          if (color !== selected) {
            onSelectColor(color);
          }
        } else {
          const newSelected = selected.includes(color)
            ? selected.filter((value) => value !== color)
            : [...selected, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect]
    );

    return (
      <Box
        ref={ref}
        component="ul"
        sx={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          display: 'inline-flex',
          ...(limit !== 'auto' && {
            width: limit * 36,
            justifyContent: 'flex-end',
          }),
          ...sx,
        }}
        {...other}
      >
        {colors?.map((color) => {
          const validColor = normalizeColor(color);
          const hasSelected = singleSelect ? selected === color : selected.includes(color);

          return (
            <Box component="li" key={color} sx={{ display: 'inline-flex' }}>
              <ButtonBase
                aria-label={color}
                onClick={() => handleSelect(color)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  ...slotProps?.button,
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: validColor,
                    borderRadius: '50%',
                    border: (theme) =>
                      `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                    ...(hasSelected && {
                      transform: 'scale(1.3)',
                      boxShadow: `4px 4px 8px 0 ${hexAlpha(validColor, 0.48)}`,
                      outline: `solid 2px ${hexAlpha(validColor, 0.08)}`,
                      transition: (theme) =>
                        theme.transitions.create('all', {
                          duration: theme.transitions.duration.shortest,
                        }),
                    }),
                  }}
                >
                  <Iconify
                    width={hasSelected ? 12 : 0}
                    icon="eva:checkmark-fill"
                    sx={{
                      color: (theme) => theme.palette.getContrastText(validColor),
                      transition: (theme) =>
                        theme.transitions.create('all', {
                          duration: theme.transitions.duration.shortest,
                        }),
                    }}
                  />
                </Stack>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    );
  }
);
