import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  Form: {
    width: "25%",
  },
  FormControl: {
    marginBottom: 20,
  },
  field: {
    marginTop: 10,
    marginBottom: 10,
  },
  crawl: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E67F8",
    color: "white",
    "&:hover": {
      color: "black",
    },
  },
}));

export default function ProductForm() {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const [data, setData] = useState([]);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const history = useHistory();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post("https://salespoint-backend.herokuapp.com/products", {
        id: data.at(-1).id + 1,
        name: name,
        description: description,
        price: parseFloat(price, 10),
      })
      .then(
        function () {
          setTimeout(function () {
            history.push("/products");
          }, 500);
        },
        function () {
          setError("Error");
          setOpen(true);
        }
      )
      .catch((error) => {
        setError(String(error));
        setOpen(true);
      });
  };

  return (
    <Fragment>
      <Typography align="center" color="primary" gutterBottom variant="h5">
        Product Form
      </Typography>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Box display="flex" justifyContent="center">
          <Box
            className={classes.Form}
            border={1}
            borderRadius={16}
            borderColor="primary"
            padding={2}
            display="flex"
            justifyContent="center"
            flexDirection="column"
          >
            <TextField
              required
              variant="outlined"
              label="name"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className={classes.field}
              inputProps={{ minLength: 2 }}
            />
            <TextField
              required
              variant="outlined"
              label="Description"
              placeholder="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className={classes.field}
              multiline
              minRows={3}
            />
            <TextField
              required
              variant="outlined"
              label="Price"
              placeholder="Price"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className={classes.field}
              type="number"
            />

            <Button
              type="submit"
              component="button"
              variant="outlined"
              color="primary"
              className={classes.button}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </form>
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
    </Fragment>
  );
}
