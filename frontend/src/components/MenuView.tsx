import { CoffeeSection } from "@/components/CoffeeSection";
import { PastrySection } from "@/components/PastrySection";

export function MenuView(): JSX.Element {
  return (
    <>
      <CoffeeSection />

      <PastrySection />
    </>
  );
}
