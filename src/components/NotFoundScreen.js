import React from "react";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";

const NotFoundScreen = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Box>
        <Box display="flex" justifyContent="center">
          <img src="cheems.png" alt="cheems" style={{ width: "50% " }} />
        </Box>
        <Box display="flex" justifyContent="center">
          <h1>404 - Not Found!</h1>
        </Box>
        <Box display="flex" justifyContent="center">
          <Link to="/">Go Home</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFoundScreen;
