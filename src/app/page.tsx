"use client";
import PrimaryButton from "@/components/shared/PrimaryButton";
import Button2 from "@/components/shared/Button2";
import { BUTTON_TEXTS, BUTTON } from "@/data/buttons";
import Filter from "@/components/shared/FilterComponent";
import SharedNavbar from "@/components/layout/SharedNavbar";

export default function Home() {
  return (
    <main>
      <SharedNavbar/>
      <PrimaryButton
        text={BUTTON_TEXTS.addStudent}
        onClick={() => console.log("Clicked!")}
      />

      <Button2
        text={BUTTON.addStudent}
        onClick={() => console.log("Clicked!")}
      />
      <Filter />




    </main>
  );
}
