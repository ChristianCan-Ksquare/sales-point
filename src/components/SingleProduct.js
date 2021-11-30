import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
  Snackbar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  product: {
    width: "50%",
  },
  img: {
    width: "10%",
    "&:hover": {
      cursor: "pointer",
    },
  },
});

export default function SingleProduct() {
  const { id } = useParams();

  let history = useHistory();
  const classes = useStyles();

  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://salespoint-backend.herokuapp.com/products/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(String(error));
        setOpen(true);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`https://salespoint-backend.herokuapp.com/cart`)
      .then((res) => {
        setCart(res.data);
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

  const handleAddToCart = async (id) => {
    let newCart = [];

    for (let i = 0; i < cart.products.length; i++) {
      delete cart.products[i].price;
      delete cart.products[i].name;
      delete cart.products[i]._id;
    }

    newCart = [...cart.products];

    newCart.push({ productId: data.id, quantity: quantity });

    await axios.put(`https://salespoint-backend.herokuapp.com/cart/`, {
      products: newCart,
    });

    alert("Product added to cart!");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box
        m={4}
        border={2}
        borderRadius={16}
        padding={2}
        textAlign="center"
        className={classes.product}
      >
        <Typography gutterBottom variant="h6" component="h2">
          {`Product #${data.id}`}
        </Typography>
        <Typography gutterBottom variant="h5" component="h2">
          {`Name: ${data.name}`}
        </Typography>
        <Typography variant="h6" color="textPrimary" component="p">
          {`Description: ${data.description}`}
        </Typography>
        <Typography variant="body1" color="textPrimary" component="p">
          {`Price: $${data.price}`}
        </Typography>
        <TextField
          label="Quantity"
          select
          InputLabelProps={{
            shrink: true,
          }}
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
        >
          {[1, 2, 3, 4, 5].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Box my={2} justifyContent="center">
          <img
            src="/./add-to-cart.png"
            alt="delete"
            className={classes.img}
            onClick={() => {
              handleAddToCart(id);
            }}
            style={{ width: "8%" }}
          />
        </Box>
        <Box display="flex" justifyContent="space-around" my={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.goBack()}
          >
            Return
          </Button>
        </Box>
      </Box>
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
    </Box>
  );
}
