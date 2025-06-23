import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import {getInvoiceStatusLabel} from "../../utils/helper";

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        // layout
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#e9ecef',
        },
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        // margin
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        // text
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        body2: { fontSize: 9 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        // table
        table: { display: 'flex', width: '100%' },
        row: {
          padding: '10px 0 8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#e9ecef',
        },
        cell_1: { width: '5%' },
        cell_2: { width: '50%' },
        cell_3: { width: '15%', paddingLeft: 32 },
        cell_4: { width: '15%', paddingLeft: 8 },
        cell_5: { width: '15%' },
        noBorder: { paddingTop: '10px', paddingBottom: 0, borderBottomWidth: 0 },
      }),
    []
  );

// ----------------------------------------------------------------------

export function InvoicePDF({ invoice, currentStatus }) {
  const {
    items,
    taxes,
    dueDate,
    discount,
    shipping,
    subtotal,
    invoiceTo,
    createDate,
    totalAmount,
    invoiceFrom,
    invoiceNumber,
  } = invoice;

  const styles = useStyles();

  const renderHeader = (
    <View style={[styles.container, styles.mb40]}>
      <Image source="/logo/butilkinaedro_logo.svg" style={{ width: 48, height: 48 }} />

      <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
        <Text style={[styles.h3, { textTransform: 'capitalize' }]}>{getInvoiceStatusLabel(currentStatus)}</Text>
        <Text> {invoiceNumber} </Text>
      </View>
    </View>
  );

  const renderFooter = (
    <View style={[styles.container, styles.footer]} fixed>
      <View style={{ width: '75%' }}>
        <Text>
          Съгласно чл.6, ал 1 от Закона за счетоводството, чл.114 от ЗДДС и чл.78 от ППЗДДС печатът и подписът не са задължителни реквизити на фактурата.
        </Text>
      </View>
      <View style={{ width: '25%', textAlign: 'right' }}>
        <Text style={styles.subtitle2}>Проблем с фактурата ?</Text>
        <Text>info@butilkinaedro.com</Text>
      </View>
    </View>
  );

  const renderInfo = (
    <View style={[styles.container, styles.mb40]}>
      <View style={{ width: '50%' }}>
        <Text style={[styles.subtitle2, styles.mb4]}>Доставчик</Text>
        <Text style={styles.body2}>{invoice.providerDetails.companyName}</Text>
        <Text style={styles.body2}>{invoice.providerDetails?.vatId || invoice.providerDetails.companyId}</Text>
        <Text style={styles.body2}>{invoice.providerDetails.companyAddress}</Text>
        <Text style={[styles.subtitle2, styles.mb4, styles.mt]}>Банкови реквизити</Text>
        <Text style={styles.body2}>            {invoice?.providerDetails?.bankDetails?.name}
        </Text>
        <Text style={styles.body2}>BIC: {invoice?.providerDetails?.bankDetails?.bic} </Text>
        <Text style={styles.body2}>IBAN: {invoice?.providerDetails?.bankDetails?.iban} (BGN)</Text>

      </View>

      <View style={{ width: '50%' }}>
        <Text style={[styles.subtitle2, styles.mb4]}>Получател</Text>
        <Text style={styles.body2}>{invoice.recipient?.companyName}</Text>
        <Text style={styles.body2}>{invoice.recipient?.vatId || invoice.recipient?.companyId}</Text>
        <Text style={styles.body2}>{invoice.recipient?.companyOwner}</Text>
        <Text style={styles.body2}>{invoice.recipient?.companyAddress}, {invoice?.recipient?.companyCity}</Text>
      </View>
    </View>
  );

  const renderTime = (
    <View style={[styles.container, styles.mb40]}>
      <View style={{ width: '50%' }}>
        <Text style={[styles.subtitle2, styles.mb4]}>Дата на създаване</Text>
        <Text style={styles.body2}>{fDate(invoice.createdAt)}</Text>
      </View>
    </View>
  );

  const renderTable = (
    <>
      <Text style={[styles.subtitle1, styles.mb8]}>Детайли за фактурата</Text>

      <View style={styles.table}>
        <View>
          <View style={styles.row}>
            <View style={styles.cell_1}>
              <Text style={styles.subtitle2}>#</Text>
            </View>
            <View style={styles.cell_2}>
              <Text style={styles.subtitle2}>Описание</Text>
            </View>
            <View style={styles.cell_3}>
              <Text style={styles.subtitle2}>Количество</Text>
            </View>
            <View style={styles.cell_4}>
              <Text style={styles.subtitle2}>Цена/бр.</Text>
            </View>
            <View style={[styles.cell_5, { textAlign: 'right' }]}>
              <Text style={styles.subtitle2}>Общо</Text>
            </View>
          </View>
        </View>

        <View>
          {items.map((item, index) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.cell_1}>
                <Text>{index + 1}</Text>
              </View>
              <View style={styles.cell_2}>
                <Text style={styles.subtitle2}>{item.title}</Text>
                <Text>{item.description}</Text>
              </View>
              <View style={styles.cell_3}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.cell_4}>
                <Text>{fCurrency(item.unitPrice * 0.8)}</Text>
              </View>
              <View style={[styles.cell_5, { textAlign: 'right' }]}>
                <Text>{fCurrency((item.unitPrice * 0.8) * item.quantity)}</Text>
              </View>
            </View>
          ))}

          {[
            { name: 'Данъчна основа (20.00 %):', value:  invoice?.total * 0.8 },
            { name: 'Доставка', value: - invoice?.shippingCost },
            { name: 'Отстъпка', value: - invoice?.discount },
            { name: 'Начислен ДДС (20.00 %)', value: invoice?.total * 0.2 },
            { name: 'Сума за плащане', value: invoice?.total, styles: styles.h4 },
          ].map((item) => (
            <View key={item.name} style={[styles.row, styles.noBorder]}>
              <View style={styles.cell_1} />
              <View style={styles.cell_2} />
              <View style={styles.cell_3} />
              <View style={styles.cell_4}>
                <Text style={item.styles}>{item.name}</Text>
              </View>
              <View style={[styles.cell_5, { textAlign: 'right' }]}>
                <Text style={item.styles}>{fCurrency(item.value)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader}

        {renderInfo}

        {renderTime}

        {renderTable}

        {renderFooter}
      </Page>
    </Document>
  );
}
