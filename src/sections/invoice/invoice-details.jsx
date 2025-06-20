import {useState, useCallback, useEffect} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { InvoiceToolbar } from './invoice-toolbar';
import {getInvoiceStatusColor, getInvoiceStatusLabel, INVOICE_STATUSES} from "../../utils/helper";
import { toast } from 'src/components/snackbar';
import { useUpdateInvoice } from 'src/utils/actionHooks';
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${tableCellClasses.root}`]: {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export function InvoiceDetails({ invoice }) {
  const {t: tCommon} = useTranslate('common')
  const [currentStatus, setCurrentStatus] = useState(null);
  const { updateAndSync } = useUpdateInvoice(invoice?._id);

  const handleChangeStatus = useCallback(async (event) => {
    const newStatus = event.target.value;
    setCurrentStatus(newStatus);

    try {
      await updateAndSync(newStatus);
      toast.success(tCommon('notifications.updateSuccess'));
    } catch (error) {
      console.error('Грешка при обновяване на статус:', error?.message);
      toast.error(tCommon('notifications.updateError'));
    }
  }, [updateAndSync]);





  useEffect(() => {
    setCurrentStatus(invoice?.status);
  }, [invoice]);

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Данъчна основа (20.00 %):
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(invoice?.total * 0.8)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Доставка</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          - {fCurrency(invoice?.shippingCost)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Отстъпка</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          - {fCurrency(invoice?.discount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Начислен ДДС (20.00 %)</TableCell>
        <TableCell width={120}>{fCurrency(invoice?.total * 0.2)}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Сума за плащане</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(invoice?.total)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
        <Grid xs={12} md={9} sx={{ py: 3 }}>
          <Typography variant="body2">
            Съгласно чл.6, ал 1 от Закона за счетоводството, чл.114 от ЗДДС и чл.78 от ППЗДДС печатът и подписът не са задължителни реквизити на фактурата.
          </Typography>
        </Grid>

        <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
          <Typography variant="subtitle2">Проблем с фактурата ?</Typography>
          <Typography variant="body2">info@butilko.com</Typography>
        </Grid>
    </Grid>
  );

  const renderList = (
    <Scrollbar sx={{ mt: 5 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <TableCell width={40}>#</TableCell>

            <TableCell sx={{ typography: 'subtitle2' }}>Описание</TableCell>

            <TableCell>Количество</TableCell>

            <TableCell align="right">Цена за бр.</TableCell>

            <TableCell align="right">Общо</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {invoice?.items.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>

              <TableCell>
                <Box sx={{ maxWidth: 560 }}>
                  <Typography variant="subtitle2">{row.title}</Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {row.description}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>{row.quantity}</TableCell>

              <TableCell align="right">{fCurrency(row.unitPrice * 0.8)}</TableCell>

              <TableCell align="right">{fCurrency((row.unitPrice * 0.8) * row.quantity)}</TableCell>
            </TableRow>
          ))}

          {renderTotal}
        </TableBody>
      </Table>
    </Scrollbar>
  );

  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={currentStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUSES}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/butilko_logo.svg"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={getInvoiceStatusColor(currentStatus)}
            >
              {getInvoiceStatusLabel(currentStatus)}
            </Label>

            <Typography variant="h6">{invoice?.invoiceNumber}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Доставчик
            </Typography>
            {invoice?.providerDetails?.companyName}
            <br />
            {invoice?.providerDetails?.companyId || invoice?.providerDetails?.vatId}
            <br />
            {invoice?.providerDetails?.companyAddress}
            <br />
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Банкови реквизити:</Typography>

            {invoice?.providerDetails?.bankDetails?.name}
            <br />
            BIC: {invoice?.providerDetails?.bankDetails?.bic}
            <br />
            IBAN: {invoice?.providerDetails?.bankDetails?.iban} (BGN)

          </Stack>

          <Stack sx={{typography: 'body2'}}>
            <Typography variant="subtitle2" sx={{mb: 1}}>
              Получател
            </Typography>
            {invoice?.recipient?.companyName}<br/>
            {invoice?.recipient?.vatId || invoice?.recipient?.companyId}<br/>
            {invoice?.recipient?.companyOwner}<br/>
            {invoice?.recipient?.companyAddress},
            {invoice?.recipient?.companyCity}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Дата на създаване
            </Typography>
            {fDate(invoice?.createdAt)}
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}
