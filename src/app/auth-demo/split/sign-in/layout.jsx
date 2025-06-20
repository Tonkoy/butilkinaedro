import { AuthSplitLayout } from 'src/layouts/auth-split';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return <AuthSplitLayout section={{ title: 'Здравей, отново' }}>{children}</AuthSplitLayout>;
}
