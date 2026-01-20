"use client";
import PrimaryButton from "@/components/shared/PrimaryButton";
import Button2 from "@/components/shared/Button2";
import { BUTTON_TEXTS, BUTTON } from "@/data/buttons";
import Filter from "@/components/shared/FilterComponent";
import SharedNavbar from "@/components/layout/SharedNavbar";
import SharedCard from "@/components/shared/SharedCard";
import { cardsData } from "@/data/SharedCard";
import { Box } from "@mui/material";
import DashboardHeader from "@/components/shared/DashboardHeader-bg";

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

      <Box>
        {cardsData.map((card) => (
          <SharedCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            description={card.description}
            onClick={() => console.log(`Clicked card ${card.id}`)}
            id={""}
          />
        ))}
      </Box>

      <DashboardHeader
        name="Ahmed"
        year="Year 2"
        subtitle="Your academic overview"
      >
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {cardsData.map((card) => (
            <SharedCard
              key={card.id}
              {...card}
              onClick={() => console.log(card.id)}
            />
          ))}
        </Box>
      </DashboardHeader>

    </main>
  );
}
