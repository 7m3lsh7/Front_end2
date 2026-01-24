"use client";

import React from "react";
import { Box } from "@mui/material";
import { mapStudentCardsToSharedCards } from "@/mappers/StudentCards.mapper";
import SharedCard from "@/components/shared/SharedCard";
import { cardsData } from "@/data/SharedCard";
import SharedNavbar from "@/components/layout/SharedNavbar";
import DashboardHeader from "@/components/shared/DashboardHeader-bg";
import { studentCardsApi } from "@/data/Student/studentcards";
const cards = mapStudentCardsToSharedCards(studentCardsApi);
export default function StudentDashboard() {


  return (
    <>

      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",

          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `
        linear-gradient(
          rgba(0, 0, 0, 0.75),
          rgba(5, 5, 10, 0.85)
        ),
        url('/Images/login/3.jpg')
      `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          },
        }}
      >
        
        {/* Page Content */}
        <Box sx={{ position: "relative", zIndex: 1, p: "10px 15px", }}>

          <Box
            sx={{
              minHeight: "calc(100vh - 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DashboardHeader
              name="Ahmed"
              year="Year 2"
              subtitle="Your academic overview"
            >
              <Box sx={{ display: "flex", gap: { xs: "20px", md: "20px", lg: "33px", xl: "75px", }, flexWrap: "wrap", justifyContent: "center" }}>
                {cards.map((card) => (
                  <SharedCard
                    key={card.id}
                    {...card}
                   
                  />
                ))}
              </Box>
            </DashboardHeader>
          </Box>

        </Box>
      </Box>

    </>
  );
}
