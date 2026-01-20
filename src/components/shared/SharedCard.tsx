import React from "react";
import { Card, Box, Typography, Divider, useTheme } from "@mui/material";
import { CardData } from "@/types/SharedCard";

export type SharedCardProps = CardData & {
    onClick?: () => void;
};

const SharedCard: React.FC<SharedCardProps> = ({
    icon: Icon,
    title,
    description,
    onClick,
}) => {
    const theme = useTheme();

    return (
        <Card
            onClick={onClick}
            tabIndex={0}
            sx={{
                width: "100%",
                maxWidth: 505,
                height: 270,
                borderRadius: 3,
                cursor: "pointer",
                bgcolor: theme.palette.background.paper,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    transform: "translateY(-2px)",
                },
                [theme.breakpoints.down("md")]: {
                    maxWidth: 400,
                    height: 240,
                },
                [theme.breakpoints.down("sm")]: {
                    maxWidth: "90vw",
                    height: 200,
                },
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    height: "55%",
                    margin: "auto",
                }}
            >
                {/* Icon + Title */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon width={40} height={40} />
                    </Box>

                    <Box sx={{ marginLeft: 2.5, flex: 1 }}>
                        <Typography variant="body4" color={theme.palette.text.primary}>
                            {title}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2.5, borderColor: theme.palette.divider }} />

                {/* Description */}
                <Box sx={{ marginLeft: 2.5, color: theme.palette.text.secondary }}>
                    <Typography variant="h5">{description}</Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default SharedCard;
