import { HomeView } from 'src/sections/home/view';
import {ComingSoonView} from "../../sections/coming-soon/view";
import {CONFIG} from "../../config-global";

// ----------------------------------------------------------------------

export const metadata = {
  title: CONFIG.appName,
  description: CONFIG.description,
};

export default function Page() {
  return <HomeView />;
}
