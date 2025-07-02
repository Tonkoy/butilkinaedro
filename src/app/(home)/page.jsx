import { HomeView } from 'src/sections/home/view';
import { HomeViewBottles } from 'src/sections/home/view';
import { HomeViewBackpacks } from 'src/sections/home/view';
import {ComingSoonView} from "../../sections/coming-soon/view";
import {CONFIG} from "../../config-global";

// ----------------------------------------------------------------------

export const metadata = {
  title: CONFIG.appName,
  description: CONFIG.description,
};

export default function Page() {
  console.log(111, process.env.NEXT_PUBLIC_FE_DOMAIN)

  if(process.env.NEXT_PUBLIC_FE_DOMAIN === 'butilkinaedro') {
    return <HomeViewBottles />;
  }

  if(process.env.NEXT_PUBLIC_FE_DOMAIN === 'ranicinaedro') {
    return <HomeViewBackpacks />;
  }

  return <HomeViewBottles />;
}
