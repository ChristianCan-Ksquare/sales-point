import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  Snackbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 20,
    paddingBottom: 20,
  },
  pages: {},
});

export default function Products() {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://salespoint-backend.herokuapp.com/products`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(String(error));
        setOpen(true);
      });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const changePage = (newPage) => {
    let totalProducts = data.length;

    let maxPages = Math.ceil(totalProducts / 10);

    if (newPage === 0 || newPage > maxPages) return;

    setPage(newPage);
  };

  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  return (
    <div>
      {!data ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <Grid container spacing={2} className={classes.gridContainer}>
            {paginate(data, 10, page).map((element, index) => (
              <Grid key={element.id} item xs={12} sm={6} md={3}>
                <ProductCard
                  key={element.id}
                  id={element.id}
                  name={element.name}
                  description={element.description}
                  price={element.price}
                />
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center" mb={2}>
            <Link to="/createProduct">
              <Button size="large" color="secondary" variant="contained">
                Add a new product
              </Button>
            </Link>
          </Box>
          <Box display="flex" justifyContent="space-between" mx={4} mt={4}>
            <Button
              size="small"
              color="primary"
              onClick={() => changePage(page - 1)}
            >
              Previous page
            </Button>
            <Typography component="h4" variant="h4">
              {page}
            </Typography>
            <Button
              size="small"
              color="primary"
              onClick={() => changePage(page + 1)}
            >
              Next page
            </Button>
          </Box>
        </Box>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={error}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
