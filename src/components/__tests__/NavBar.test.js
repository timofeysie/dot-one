import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock the useClickOutsideToggle hook
jest.mock("../../hooks/useClickOutsideToggle", () => ({
  __esModule: true,
  default: () => ({
    expanded: false,
    setExpanded: jest.fn(),
    ref: { current: null },
  }),
}));

// Mock the CurrentUserContext hooks
jest.mock("../../contexts/CurrentUserContext", () => ({
  useCurrentUser: jest.fn(),
  useSetCurrentUser: jest.fn(),
}));

// Import the actual hooks after mocking
const { useCurrentUser, useSetCurrentUser } = require("../../contexts/CurrentUserContext");

describe("NavBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders NavBar with user logged in", () => {
    useCurrentUser.mockReturnValue({
      profile_id: 1,
      profile_image: "https://example.com/image.jpg",
      username: "testuser"
    });
    useSetCurrentUser.mockReturnValue(jest.fn());

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.getByText(/feed/i)).toBeInTheDocument();
    expect(screen.getByText(/liked/i)).toBeInTheDocument();
    expect(screen.getByText(/polls/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    expect(screen.getByText(/add post/i)).toBeInTheDocument();
  });

  test("renders NavBar with user logged out", () => {
    useCurrentUser.mockReturnValue(null);
    useSetCurrentUser.mockReturnValue(jest.fn());

    render(
      <Router>
        <NavBar />
      </Router>
    );

    // Check for logged-out navigation links
    const navLinks = screen.getAllByRole('link');
    const signInLink = navLinks.find(link => link.href.includes('/signin'));
    const signUpLink = navLinks.find(link => link.href.includes('/signup'));

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
    
    // Verify logged-in content is not present
    expect(screen.queryByText(/feed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/liked/i)).not.toBeInTheDocument();
  });

  test("handles sign out", async () => {
    const mockSetCurrentUser = jest.fn();
    useCurrentUser.mockReturnValue({
      profile_id: 1,
      profile_image: "https://example.com/image.jpg",
      username: "testuser"
    });
    useSetCurrentUser.mockReturnValue(mockSetCurrentUser);

    // Mock successful axios response
    axios.post.mockResolvedValueOnce({});

    render(
      <Router>
        <NavBar />
      </Router>
    );

    const signOutLink = screen.getByText(/sign out/i);
    fireEvent.click(signOutLink);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("dj-rest-auth/logout/");
      expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
    });
  });
});