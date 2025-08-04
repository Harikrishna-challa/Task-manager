// src/App.test.js
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

test("renders App without crashing", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Check if header or any visible text exists
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
