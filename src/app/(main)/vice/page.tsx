"use client";
import { mapViceCardsToSharedCards } from "@/mappers/viceCards.mapper";

import React from "react";
import {
  Box,
} from "@mui/material";

import SharedNavbar from "@/components/layout/SharedNavbar";
import DashboardHeader from "@/components/shared/DashboardHeader-bg";
import SharedCard from "@/components/shared/SharedCard";
import { viceCardsApi } from "@/data/vice/vicecards";
const cards = mapViceCardsToSharedCards(viceCardsApi);
export default function ViceDashboard() {

  return (
      <>
      <Box
        sx={{
          height: "100%",
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
              minHeight: "calc(100vh - 100px)",
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
                  <SharedCard key={card.id} {...card} />
                ))}
              </Box>
            </DashboardHeader>
          </Box>

        </Box>
      </Box>

    </>


  );
}
