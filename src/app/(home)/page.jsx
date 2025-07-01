import { HomeView } from 'src/sections/home/view';
import { HomeViewBottles } from 'src/sections/home/view';
import {ComingSoonView} from "../../sections/coming-soon/view";
import {CONFIG} from "../../config-global";

// ----------------------------------------------------------------------

export const metadata = {
  title: CONFIG.appName,
  description: CONFIG.description,
};

export default function Page() {
  console.log(111, process.env.NEXT_PUBLIC_FE_DOMAIN)
  return <HomeViewBottles />;
}
