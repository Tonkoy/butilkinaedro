import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form, Field } from 'src/components/hook-form';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutBillingInfo } from './checkout-billing-info';
import { CheckoutPaymentMethods } from './checkout-payment-methods';
import { CheckoutDelivery } from './checkout-delivery';
import { CheckoutOrderComplete } from './checkout-order-complete';
import { Iconify } from 'src/components/iconify';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import { createOrder } from '../../actions/order';
import {
  useGetCompany,
  createCompany,
  updateCompany,
} from 'src/actions/company';
import { toast } from 'src/components/snackbar';
import {usePrefillCompanyFields} from "../../utils/hooks";
import Link from 'next/link'
import {useAuthContext} from "../../auth/hooks";

const PaymentSchema = zod
  .object({
    payment: zod.string().min(1, { message: 'Начин на плащане е задължителен' }),
    delivery: zod.number(),
    comment: zod.string().optional(),
    invoiceRequested: zod.boolean().optional().default(false),
    companyName: zod.string().optional(),
    companyId: zod.string().optional(),
    vatRegistration: zod.boolean().optional(),
    vatId: zod.string().optional(),
    companyAddress: zod.string().optional(),
    companyCity: zod.string().optional(),
    country: zod.string().optional(),
    companyOwner: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.invoiceRequested) {
      if (!data.companyName) ctx.addIssue({ path: ['companyName'], message: 'Име на фирма е задължително', code: 'custom' });
      if (!data.companyId) ctx.addIssue({ path: ['companyId'], message: 'ЕИК е задължително поле', code: 'custom' });
      if (!data.companyAddress) ctx.addIssue({ path: ['companyAddress'], message: 'Адрес е задължително поле', code: 'custom' });
      if (!data.companyCity) ctx.addIssue({ path: ['companyCity'], message: 'Град е задължително поле', code: 'custom' });
      if (!data.country) ctx.addIssue({ path: ['country'], message: 'Държава е задължително поле', code: 'custom' });
      if (!data.companyOwner) ctx.addIssue({ path: ['companyOwner'], message: 'МОЛ е задължително поле', code: 'custom' });
      if (data.vatRegistration && !data.vatId) {
        ctx.addIssue({ path: ['vatId'], message: 'ДДС номер е задължителен при регистрация по ДДС', code: 'custom' });
      }
    }
  });

export function CheckoutPayment({ sx, ...other }) {
  const router = useRouter();
  const checkout = useCheckoutContext();
  const { company, refreshCompany } = useGetCompany();
  const { user } = useAuthContext();

  const { billing, items, shipping, subtotal, total, totalItems } = checkout;

  console.log(billing)

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      delivery: checkout.shipping,
      payment: '',
      comment: '',
      invoiceRequested: false,
      companyName: '',
      companyId: '',
      vatRegistration: false,
      vatId: '',
      companyAddress: '',
      companyCity: '',
      country: '',
      companyOwner: '',
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchInvoice = watch('invoiceRequested');
  const watchVat = watch('vatRegistration');

  usePrefillCompanyFields({
    watchInvoice,
    company,
    reset,
    getValues: methods.getValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.invoiceRequested) {
        const invoiceData = {
          companyName: data.companyName,
          companyTaxId: data.companyId,
          companyAddress: data.companyAddress,
          companyCity: data.companyCity,
          country: data.country,
          vatRegistration: data.vatRegistration,
          vatId: data.vatId,
          companyOwner: data.companyOwner,
        };

        const existing = {
          companyName: company.companyName,
          companyTaxId: company.companyTaxId,
          companyAddress: company.companyAddress,
          companyCity: company.companyCity,
          country: company.country,
          vatRegistration: company.vatRegistration,
          vatId: company.vatId,
          companyOwner: company.companyOwner,
        };

        const hasChanged = Object.keys(invoiceData).some(
          (key) => invoiceData[key] !== existing[key]
        );

        if (!company?._id) {
          await createCompany(invoiceData, refreshCompany);
          toast.success('Фирмените данни са създадени успешно!');
        } else if (hasChanged) {
          await updateCompany({ ...invoiceData, companyId: company._id }, refreshCompany);
          toast.success('Фирмените данни са обновени успешно!');
        }
      }

      const fullAddress = billing?.deliveryType === 'address'
        ? `${billing.address}, ${billing.city}`
        : `${billing.selectedOffice.id}, ${billing.selectedOffice.name}, ${billing?.selectedOffice?.address?.fullAddressString}`;

      const orderData = {
        total,
        totalItems,
        subTotal: subtotal,
        items,
        recipient: billing.name,
        fullAddress,
        phoneNumber: billing.phoneNumber,
        deliveryMethod: billing.deliveryMethod,
        paymentType: data.payment,
        comment: data.comment || '',
        invoiceRequested: data.invoiceRequested,
        userId: user?._id || null,
        tracking: {
          shippingOffice: billing?.selectedOffice,
          shippingCompany: billing.selectedCourier?.label || '',
          shippingStatus: false
        }
      };

      const response = await createOrder(orderData);
      if (response) {
        setOrderSuccess(true);
        setOrderData(response);
        checkout.onReset();
      }
    } catch (error) {
      toast.error('Грешка при създаване на поръчката');
      console.error('Error creating order:', error.response?.data || error);
    }
  });

  const resetOrderComplete = () => {
    router.push(paths.products.root);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutDelivery
            name="delivery"
            onApplyShipping={checkout.onApplyShipping}
            options={[{ value: 0, label: 'За сметка на купувача', description: 'в зависимост от куриера' }]}
          />

          <CheckoutPaymentMethods
            name="payment"
            options={{ cards: [], payments: [{ value: 'cash', label: 'Наложен платеж', description: 'Платете при получаване' }] }}
            sx={{ my: 3 }}
          />

          <Card sx={{ p: 4, mb: 3 }}>
            <Field.Switch
              name="invoiceRequested"
              disabled={!user} // 👈 Prevent toggling if not logged in
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Издаване на фактура
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Активирайте тази опция, ако желаете да получите фактура с поръчката си.
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {!user &&
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Моля, <Link href={paths.auth.jwt.signUp}>се регистрирайте</Link>, за да заявите фактура.
              </Typography>
            }

            {watchInvoice && (
              <>
                <Field.Switch
                  name="vatRegistration"
                  labelPlacement="start"
                  label="Регистрация по ДДС"
                  sx={{ my: 2 }}
                />
                <Field.Text sx={{ mb: 2 }} name="companyName" label="Име на фирма" />
                <Field.Text sx={{ mb: 2 }} name="companyId" label="ЕИК (Булстат)" />
                {watchVat && <Field.Text sx={{ mb: 2 }} name="vatId" label="ДДС Номер" />}
                <Field.Text sx={{ mb: 2 }} name="companyAddress" label="Адрес" />
                <Field.Text sx={{ mb: 2 }} name="companyCity" label="Град" />
                <Field.Text sx={{ mb: 2 }} name="country" label="Държава" />
                <Field.Text sx={{ mb: 2 }} name="companyOwner" label="МОЛ" />
              </>
            )}
          </Card>

          <Card sx={{ p: 4 }}>
            <Field.Text
              name="comment"
              label="Коментар към поръчката"
              multiline
              rows={3}
              placeholder="Добавете допълнителни инструкции или коментари (по избор)"
            />
          </Card>

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Назад
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo billing={billing} onBackStep={checkout.onBackStep} />

          <CheckoutSummary
            total={checkout.total}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Завършване на поръчката
          </LoadingButton>
        </Grid>

        {orderSuccess && (
          <CheckoutOrderComplete
            open={orderSuccess}
            order={orderData}
            onReset={resetOrderComplete}
            onDownloadPDF={() => {}}
          />
        )}
      </Grid>
    </Form>
  );
}
