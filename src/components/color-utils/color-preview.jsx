import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { varAlpha } from 'src/theme/styles';

export const ColorPreview = forwardRef(({ colors = [], limit = 3, sx, ...other }, ref) => {
  // Safely slice colors up to the limit
  const colorsRange = colors.slice(0, limit);

  // Calculate remaining colors
  const restColors = colors.length > limit ? colors.length - limit : 0;

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        ...sx,
      }}
      {...other}
    >
      {/* Render color dots */}
      {colorsRange.map((color, index) => {
        if (!color) return null; // Skip if color is null or undefined
        return (
          <Box
            key={`${color}-${index}`}
            sx={{
              ml: -0.75,
              width: 16,
              height: 16,
              bgcolor: color, // Use the color value
              borderRadius: '50%',
              border: (theme) => `solid 2px ${theme.vars.palette.background.paper}`,
              boxShadow: (theme) =>
                `inset -1px 1px 2px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
            }}
          />
        );
      })}

      {/* Render remaining color count if applicable */}
      {restColors > 0 && (
        <Box component="span" sx={{ typography: 'subtitle2' }}>{`+${restColors}`}</Box>
      )}
    </Box>
  );
});
