import React from "react";
import { Box, Typography } from "@material-ui/core";

export default function LandingPage() {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography variant="h3" color="textPrimary">
          Welcome to the shop!
        </Typography>
        <Box m={2}>
          <Typography variant="h6" color="textPrimary">
            This is a sales-point to manage your personal shop!
          </Typography>
        </Box>
        <img src={"shop.png"} alt="Logo" style={{ width: "15%" }} />
      </Box>
    </Box>
  );
}
