import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Snackbar,
  TextField,
} from "@material-ui/core";
import StarsIcon from "@material-ui/icons/Stars";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  li: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Cart() {
  const classes = useStyles();

  const [cart, setCart] = useState();
  const [sells, setSells] = useState();
  const [refresh, setRefresh] = useState(false);
  const [money, setMoney] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

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
  }, [refresh]);

  useEffect(() => {
    axios
      .get(`https://salespoint-backend.herokuapp.com/sells`)
      .then((res) => {
        setSells(res.data);
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

  const handleRemoveFromCart = async (id, quantity) => {
    let newCart = [];

    for (let i = 0; i < cart.products.length; i++) {
      delete cart.products[i].price;
      delete cart.products[i].name;
      delete cart.products[i]._id;
    }

    newCart = [...cart.products];

    let index = newCart.findIndex(function (obj) {
      return obj.productId === id && obj.quantity === quantity;
    });

    newCart.splice(index, 1);

    await axios
      .put(`https://salespoint-backend.herokuapp.com/cart/`, {
        products: newCart,
      })
      .then(alert("Product removed from cart!"))
      .catch((error) => {
        setError(String(error));
        setOpen(true);
      });
    setRefresh(!refresh);
  };

  const handleFinishSell = async (total) => {
    let newCart = [];

    if (total > money) {
      alert("Not enough money!");
    } else {
      if (cart.products.length === 0) {
        alert("The are no products in the cart right now.");
      } else {
        let change = money - total;

        for (let i = 0; i < cart.products.length; i++) {
          delete cart.products[i].price;
          delete cart.products[i]._id;
        }

        newCart = [...cart.products];

        let date =
          new Date().getDate() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getFullYear();

        let id = sells.length === 0 ? 1 : parseInt(sells.at(-1).id, 10) + 1;

        let sell = {
          id: id,
          total: parseFloat(total.toFixed(2), 10),
          products: [...newCart],
          date: date,
          status: "finished",
        };

        await axios
          .post("https://salespoint-backend.herokuapp.com/sells", sell)
          .then(
            await axios
              .put("https://salespoint-backend.herokuapp.com/cart", {
                products: [],
              })
              .then(
                alert(
                  `Sell was finished sucessfully! \n Change: $${change.toFixed(
                    2
                  )}`
                )
              )
              .catch((error) => {
                setError(String(error));
                setOpen(true);
              })
          )
          .catch((error) => {
            setError(String(error));
            setOpen(true);
          });
        setMoney(0);
        setRefresh(!refresh);
      }
    }
  };

  return (
    <div className={classes.root}>
      {!cart ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box padding={2} margin={2}>
          <List component="nav" aria-label="main mailbox folders" border={2}>
            <ListItem alignItems="flex-start" divider>
              <ListItemIcon></ListItemIcon>
              <ListItemText className={classes.li} primary="Product Name" />
              <ListItemText className={classes.li} primary="Quantity" />
              <ListItemText className={classes.li} primary="Price" />
              <ListItemText className={classes.li} primary="Total Price" />
              <ListItemText className={classes.li} primary="Remove" />
            </ListItem>
            {cart.products.map((element, index) => {
              return (
                <Box key={index}>
                  <ListItem className={classes.li} divider>
                    <ListItemIcon>
                      <StarsIcon />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.li}
                      primary={element.name}
                    />
                    <ListItemText
                      className={classes.li}
                      primary={element.quantity}
                    />

                    <ListItemText
                      className={classes.li}
                      primary={`$ ${parseFloat(element.price, 10).toFixed(2)}`}
                    />
                    <ListItemText className={classes.li} />
                    <ListItemText className={classes.li} />

                    <Checkbox
                      onChange={() => {
                        handleRemoveFromCart(
                          parseInt(element.productId, 10),
                          parseInt(element.quantity, 10)
                        );
                      }}
                    />
                  </ListItem>
                </Box>
              );
            })}
            <ListItem divider>
              <ListItemIcon></ListItemIcon>
              <ListItemText className={classes.li} />
              <ListItemText
                className={classes.li}
                primary={`$ ${cart.products
                  .map((element) => {
                    return parseFloat(element.price, 10);
                  })
                  .reduce((a, b) => a + b, 0)
                  .toFixed(2)}`}
              />
            </ListItem>
          </List>
          <Box display="flex" justifyContent="space-around">
            <TextField
              required
              variant="outlined"
              label="Client's money"
              placeholder="Client's money"
              value={money}
              onChange={(e) => {
                setMoney(e.target.value);
              }}
              className={classes.field}
              type="number"
            />

            <Button
              size="large"
              color="secondary"
              variant="contained"
              onClick={() => {
                handleFinishSell(
                  parseFloat(
                    cart.products
                      .map((element) => {
                        return parseFloat(element.price, 10);
                      })
                      .reduce((a, b) => a + b, 0),
                    (10).toFixed(2)
                  )
                );
              }}
            >
              Finish Sell
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
