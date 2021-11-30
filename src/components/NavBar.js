import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navBar: {
    backgroundColor: "#2E67F8",
    height: 50,
  },
  link: {
    color: "#FFFFFF",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

function NavBar() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      className={classes.navBar}
      mb={2}
    >
      <Box className={classes.link}>
        <Link to="/" style={{ textDecoration: "inherit", color: "inherit" }}>
          Landing Page
        </Link>
      </Box>

      <Box className={classes.link}>
        <Link
          to="/products"
          style={{ textDecoration: "inherit", color: "inherit" }}
        >
          Products
        </Link>
      </Box>
      <Box className={classes.link}>
        <Link
          to="/cart"
          style={{ textDecoration: "inherit", color: "inherit" }}
        >
          Shopping Cart
        </Link>
      </Box>
      <Box className={classes.link}>
        <Link
          to="/sells"
          style={{ textDecoration: "inherit", color: "inherit" }}
        >
          Sells
        </Link>
      </Box>
      <Box className={classes.link}>
        <Link
          to="/charts"
          style={{ textDecoration: "inherit", color: "inherit" }}
        >
          Charts
        </Link>
      </Box>
    </Box>
  );
}

export default NavBar;
