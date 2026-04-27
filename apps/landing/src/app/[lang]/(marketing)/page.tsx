import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Features } from "@/components/sections/features";
import { Folders } from "@/components/sections/folders";
import { Showcase } from "@/components/sections/showcase";
import { Stats } from "@/components/sections/stats";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

const APP_STORE_URL = "https://apps.apple.com/app/echoes/id0";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.carlos3g.echoes";

export default async function LandingPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main>
        <Hero dict={dict} />
        <Manifesto dict={dict} />
        <Features dict={dict} />
        <Folders dict={dict} />
        <Showcase dict={dict} />
        <Stats dict={dict} />
        <CTA dict={dict} iosUrl={APP_STORE_URL} androidUrl={PLAY_STORE_URL} />
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
