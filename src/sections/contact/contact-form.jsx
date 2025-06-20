'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {Form, Field, schemaHelper} from 'src/components/hook-form';
import { useTranslate } from 'src/locales';
import {sendContactForm} from "../../actions/contact";
import {toast} from "sonner";
import {isValidPhoneNumber} from "react-phone-number-input/input";

// ----------------------------------------------------------------------

export const ContactFormSchema = (tCommon) =>
  zod.object({
    name: zod.string().min(1, { message: tCommon('errors.required') }),
    email: zod
      .string()
      .min(1, { message: tCommon('errors.required') })
      .email({ message: tCommon('errors.emailInvalid') }),
    phoneNumber: schemaHelper.phoneNumber({
      isValidPhoneNumber,
      message: tCommon('errors.phoneInvalid')
    }),
    subject: zod.string().min(1, { message: tCommon('errors.required') }),
    message: zod.string().min(1, { message: tCommon('errors.required') }),
  });

// ----------------------------------------------------------------------

export function ContactForm({ sx, ...other }) {
  const { t: tContact } = useTranslate('contacts');
  const { t: tCommon } = useTranslate('common');

  const defaultValues = {
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  };

  const methods = useForm({
    resolver: zodResolver(ContactFormSchema(tCommon)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await sendContactForm(data);
      if(!res.success) {
        toast.error(tCommon(res.error));
        console.error(error);
      }
      toast.success(tCommon('notifications.sentSuccess'));
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || tCommon('notifications.sentError'));
    }
  });

  return (
    <Box sx={sx} {...other}>
      <Typography variant="h3">
        {tContact('general.formTitle')} <br />
        {tContact('general.formSubtitle')}
      </Typography>

      <Form methods={methods} onSubmit={onSubmit}>
        <Box gap={3} display="flex" flexDirection="column" sx={{ my: 5 }}>
          <Field.Text name="name" label={tCommon('forms.name')} fullWidth />
          <Field.Text name="email" label={tCommon('forms.email')} fullWidth />
          <Field.Phone
            country="BG"
            placeholder={tCommon('forms.phonePlaceholder')}
            name="phoneNumber"
            label={tCommon('forms.phone')}
          />
          <Field.Text name="subject" label={tContact('forms.subject')} fullWidth />
          <Field.Text
            name="message"
            label={tContact('forms.message')}
            multiline
            rows={4}
            fullWidth
          />
        </Box>

        <Button
          type="submit"
          size="large"
          variant="contained"
          disabled={isSubmitting}
        >
          {tCommon('buttons.send')}
        </Button>
      </Form>
    </Box>
  );
}
