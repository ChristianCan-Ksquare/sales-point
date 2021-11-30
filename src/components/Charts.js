import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Bar, Line } from "react-chartjs-2";

export default function Charts() {
  const [sells, setSells] = useState();
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
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function getSalesByDate(array) {
    const dates = array.map((e) => {
      return e.date;
    });

    const counts = {};
    dates.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    return counts;
  }

  function getTotalMoneyFromSalesByDate(array) {
    const dates = array.map((e) => {
      return { [e.date]: e.total };
    });

    return dates;
  }

  function getCancelledSalesByDate(array) {
    const datesCancelled = array.filter((e) => e.status === "cancelled");

    const dates = datesCancelled.map((e) => {
      return e.date;
    });

    const counts = {};
    dates.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    return counts;
  }

  function getTotalMoneyFromCancelledSales(array, string) {
    if (string === "") {
      const dates = array.map((e) => {
        return e.total;
      });

      return dates.reduce(function (a, b) {
        return a + b;
      });
    } else {
      const datesType = array.filter((e) => e.status === string);

      const dates2 = datesType.map((e) => {
        return e.total;
      });

      return dates2.reduce(function (a, b) {
        return a + b;
      });
    }
  }

  function getSellingProducts(array, string) {
    //Get all products from sells
    const sellsProducts = array.map((e) => {
      return e.products;
    });
    //Merge them in a single array
    let merged = [].concat.apply([], sellsProducts);

    //If quantity is bigger than 1, add the equivalent number of products to merged
    for (let i = 0; i < merged.length; i++) {
      if (merged[i].quantity > 1) {
        for (let j = 0; j < merged[i].quantity; j++) {
          merged.push({
            productId: merged[i].productId,
            quantity: 1,
            name: merged[i].name,
            _id: merged[i]._id,
          });
        }
      }
    }
    //Remove products with quantity bigger than 1
    const singleProducts = merged.filter((e) => e.quantity === 1);

    //Get only product names
    const productsNames = singleProducts.map((e) => {
      return e.name;
    });

    //Get object with number of product as property and quantity of that product as value
    let occurrences = productsNames.reduce(function (occ, item) {
      occ[item] = (occ[item] || 0) + 1;
      return occ;
    }, {});

    //Make array of arrays (each array is a pair [productName, totalQuantity])
    let productsNamesAndQuantities = [];
    for (let oc in occurrences) {
      productsNamesAndQuantities.push([oc, occurrences[oc]]);
    }

    //"best" means top 5 popular products
    //"worst" means top 5 not popular products
    if (string === "best") {
      const goodProducts = productsNamesAndQuantities
        .sort(function (a, b) {
          return a[1] - b[1];
        })
        .reverse()
        .slice(0, 5);
      return goodProducts;
    } else if (string === "worst") {
      const badProducts = productsNamesAndQuantities
        .sort(function (a, b) {
          return a[1] - b[1];
        })
        .slice(0, 5);
      return badProducts;
    }
  }

  return (
    <div>
      {!sells ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <div>
          {sells.length === 0 ? (
            <Typography
              align="center"
              color="primary"
              gutterBottom
              variant="h4"
              component="h4"
            >
              There are no sales data right now!
            </Typography>
          ) : (
            <Box>
              <Box>
                <Typography
                  align="center"
                  color="secondary"
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  Total sales
                </Typography>

                <Bar
                  data={{
                    labels: Object.keys(getSalesByDate(sells)),
                    datasets: [
                      {
                        label: "Sales",
                        data: Object.values(getSalesByDate(sells)),
                        backgroundColor: "#DC143C",
                        borderColor: "blue",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  height={200}
                  width={300}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "# of Sales",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Days",
                          },
                        },
                      ],
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  align="center"
                  color="secondary"
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  Total money got from sales
                </Typography>
                <Line
                  data={{
                    labels: getTotalMoneyFromSalesByDate(sells).map((e) => {
                      return Object.keys(e)[0];
                    }),
                    datasets: [
                      {
                        label: "Total money",
                        data: getTotalMoneyFromSalesByDate(sells).map((e) => {
                          return Object.values(e)[0];
                        }),
                        backgroundColor: "#32CD32",
                        borderColor: "blue",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  height={200}
                  width={300}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "$ Money",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Sales",
                          },
                        },
                      ],
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  align="center"
                  color="secondary"
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  Total cancelled sales
                </Typography>
                <Bar
                  data={{
                    labels: Object.keys(getCancelledSalesByDate(sells)),
                    datasets: [
                      {
                        label: "Cancelled Sales",
                        data: Object.values(getCancelledSalesByDate(sells)),
                        backgroundColor: "orange",
                        borderColor: "blue",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  height={200}
                  width={300}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "# of Sales",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Days",
                          },
                        },
                      ],
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  align="center"
                  color="secondary"
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  Total money lost from cancelled sales
                </Typography>
                <Bar
                  data={{
                    labels: [
                      "Finished sales vs Total sales",
                      "Cancelled sales vs Total sales",
                    ],
                    datasets: [
                      {
                        label: "Money",
                        data: [
                          getTotalMoneyFromCancelledSales(sells, "finished"),
                          getTotalMoneyFromCancelledSales(sells, "cancelled"),
                        ],
                        backgroundColor: "orange",
                        borderColor: "blue",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                      {
                        label: "Total money",
                        data: [
                          getTotalMoneyFromCancelledSales(sells, ""),
                          getTotalMoneyFromCancelledSales(sells, ""),
                        ],
                        backgroundColor: "red",
                        borderColor: "blue",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  height={200}
                  width={300}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "$ Money",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Sales",
                          },
                        },
                      ],
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  align="center"
                  color="secondary"
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  Top popular products
                </Typography>
                <Bar
                  data={{
                    labels: getSellingProducts(sells, "best").map((e) => {
                      return e[0];
                    }),
                    datasets: [
                      {
                        label: "Products",
                        data: getSellingProducts(sells, "best").map((e) => {
                          return e[1];
                        }),
                        backgroundColor: "#00FFFF",
                        borderColor: "brown",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  height={200}
                  width={300}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "# of Products Sold",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Products",
                          },
                        },
                      ],
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  align="center"
                  color="secondary"
                  gutterBottom
                  variant="h5"
                  component="h5"
                >
                  Top not popular products
                </Typography>
                <Bar
                  data={{
                    labels: getSellingProducts(sells, "worst").map((e) => {
                      return e[0];
                    }),
                    datasets: [
                      {
                        label: "Products",
                        data: getSellingProducts(sells, "worst").map((e) => {
                          return e[1];
                        }),
                        backgroundColor: "#808080",
                        borderColor: "black",
                        barPercentage: 0.5,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  height={200}
                  width={300}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "# of Products Sold",
                          },
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Products",
                          },
                        },
                      ],
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </div>
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
