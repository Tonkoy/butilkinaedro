import {AccountView} from "../../sections/account/view";
import {AuthGuard} from "../../auth/guard";
// ----------------------------------------------------------------------

export default function AccountPage() {
  return <AuthGuard>
    <AccountView/>
  </AuthGuard>;
}
