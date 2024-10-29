import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GuestPage from "./components/GuestPage";
import LoginSignupPage from "./components/LoginSignupPage";
import TestDashboard from "./components/TestDashboard"; // Import the Dashboard component
import CreateListing from "./components/CreateListing";
import ViewItem from "./components/ViewItem";
import UpdateItem from "./components/UpdateItem";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Puhs8GGxGJHSJZoM24yUBvdgu9rJTTP1ubehsGaWzX1pECBNW20jXG1Fk51JH631tadBYt39oEsChBrKtOxAHHB00wWxBGtAt"
);

const Checkout = lazy(() => import("./components/Checkout"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/login-signup" element={<LoginSignupPage />} />
          <Route path="/testdashboard" element={<TestDashboard />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/view-item/:id" element={<ViewItem />} />
          <Route path="/update-item/:id" element={<UpdateItem />} />
          {/* Wrap the Checkout route with Elements to only initialize Stripe on the Checkout page */}
          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
