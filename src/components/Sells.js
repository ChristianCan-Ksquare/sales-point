import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Snackbar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import StarsIcon from "@material-ui/icons/Stars";

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

export default function Sells() {
  const classes = useStyles();

  const [sells, setSells] = useState();
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

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
  }, [refresh]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCancelSell = async (id, status) => {
    let sell = {
      id: id,
      status: "cancelled",
    };

    await axios
      .put("https://salespoint-backend.herokuapp.com/sells", sell)
      .then(alert("Sell canceled!"))
      .catch((error) => {
        setError(String(error));
        setOpen(true);
      });

    setRefresh(!refresh);
  };

  return (
    <div className={classes.root}>
      {!sells ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box padding={2} margin={2}>
          <List component="nav" aria-label="main mailbox folders" border={2}>
            <ListItem alignItems="flex-start" divider>
              <ListItemIcon></ListItemIcon>
              <ListItemText className={classes.li} primary="Products" />
              <ListItemText className={classes.li} primary="Total" />
              <ListItemText className={classes.li} primary="Date" />
              <ListItemText className={classes.li} primary="Status" />
              <ListItemText className={classes.li} primary="Cancel Sell" />
            </ListItem>
            {sells.map((element, index) => {
              return (
                <Box key={index}>
                  <ListItem divider>
                    <ListItemIcon>
                      <StarsIcon />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.li}
                      primary={element.products.map((element, index) => {
                        return (
                          <p key={index}>
                            {element.quantity} {element.name}
                          </p>
                        );
                      })}
                    />
                    <ListItemText
                      className={classes.li}
                      primary={element.total}
                    />
                    <ListItemText
                      className={classes.li}
                      primary={element.date}
                    />
                    <ListItemText
                      className={classes.li}
                      primary={element.status}
                    />
                    <ListItemText className={classes.li} />
                    {element.status === "cancelled" ? (
                      <Checkbox style={{ visibility: "hidden" }} />
                    ) : (
                      <Checkbox
                        onChange={() => {
                          handleCancelSell(element.id, element.status);
                        }}
                      />
                    )}
                  </ListItem>
                </Box>
              );
            })}
          </List>
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
