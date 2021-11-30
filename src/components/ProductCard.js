import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    height: "100%",
    backgroundColor: "#FFF5EC",
  },
});

export default function ProductCard(props) {
  const classes = useStyles();
  const { id, name, description, price } = props;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          color="textPrimary"
          component="p"
        >
          {description}
        </Typography>
        <Typography gutterBottom variant="h6" color="textPrimary" component="p">
          {`$${price.toFixed(2)}`}
        </Typography>
        <CardActions>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link to={`/products/${id}`} style={{ textDecoration: "none" }}>
              See more
            </Link>
          </Box>
        </CardActions>
      </CardContent>
    </Card>
  );
}
