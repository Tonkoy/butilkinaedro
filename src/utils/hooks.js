import { useAuthContext } from "../auth/hooks";
import { useEffect } from 'react';

export function usePrefillCompanyFields({ watchInvoice, company, reset, getValues }) {
  useEffect(() => {
    if (!watchInvoice || !company || !company.companyName) return;

    const currentValues = getValues();

    const nextValues = {
      companyName: company.companyName || '',
      companyId: company.companyTaxId || '',
      companyAddress: company.companyAddress || '',
      companyCity: company.companyCity || '',
      country: company.country || '',
      vatRegistration: company.vatRegistration || false,
      vatId: company.vatId || '',
      companyOwner: company.companyOwner || '',
    };

    const shouldReset = Object.keys(nextValues).some(
      (key) => currentValues[key] !== nextValues[key]
    );

    if (shouldReset) {
      reset({ ...currentValues, ...nextValues });
    }
  }, [watchInvoice, company, reset, getValues]);
}

function useIsAdmin() {
  const { user } = useAuthContext();
  return user?.role === 'admin';
}

function useIsOwner() {
  const { user } = useAuthContext();
  return user?.role === 'owner';
}


function useIsAuthenticated() {
  const { user } = useAuthContext();
  return user?.role === 'user' || user?.role === 'admin' || user?.role === 'owner';
}



export {
  useIsAdmin,
  useIsAuthenticated,
  useIsOwner
}
