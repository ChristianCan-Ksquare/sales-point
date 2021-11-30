import React from "react";
import Cart from "./components/Cart";
import Charts from "./components/Charts";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
import NotFoundScreen from "./components/NotFoundScreen";
import Products from "./components/Products";
import ProductForm from "./components/ProductForm";
import SingleProduct from "./components/SingleProduct";
import Sells from "./components/Sells";
import { BrowserRouter, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <LandingPage />
        </Route>
        <Route path="/products" exact>
          <Products />
        </Route>
        <Route path="/products/:id" exact>
          <SingleProduct />
        </Route>
        <Route exact path="/createProduct">
          <ProductForm />
        </Route>
        <Route exact path="/cart">
          <Cart />
        </Route>
        <Route exact path="/sells">
          <Sells />
        </Route>
        <Route exact path="/charts">
          <Charts />
        </Route>
        <Route path="/" component={NotFoundScreen} />
      </Switch>
    </BrowserRouter>
  );
}
