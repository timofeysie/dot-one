import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock the useClickOutsideToggle hook
jest.mock("../hooks/useClickOutsideToggle", () => ({
  __esModule: true,
  default: () => ({
    expanded: false,
    setExpanded: jest.fn(),
    ref: { current: null },
  }),
}));

describe("NavBar", () => {
  const renderNavBar = (currentUser = null) => {
    const setCurrentUser = jest.fn();
    const contextValue = {
      currentUser,
      setCurrentUser,
    };

    render(
      <CurrentUserContext.Provider value={contextValue}>
        <Router>
          <NavBar />
        </Router>
      </CurrentUserContext.Provider>
    );

    return { setCurrentUser };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders NavBar with user logged in", () => {
    const currentUser = {
      profile_id: 1,
      profile_image: "https://example.com/image.jpg",
      username: "testuser"
    };

    renderNavBar(currentUser);

    // Check for logged-in navigation links
    expect(screen.getByText(/feed/i)).toBeInTheDocument();
    expect(screen.getByText(/liked/i)).toBeInTheDocument();
    expect(screen.getByText(/polls/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    expect(screen.getByText(/add post/i)).toBeInTheDocument();
  });

  test("renders NavBar with user logged out", () => {
    renderNavBar(null);

    // Check for logged-out navigation links
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    
    // Verify logged-in content is not present
    expect(screen.queryByText(/feed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/liked/i)).not.toBeInTheDocument();
  });

  test("handles sign out", async () => {
    const currentUser = {
      profile_id: 1,
      profile_image: "https://example.com/image.jpg",
      username: "testuser"
    };

    // Mock successful axios response
    axios.post.mockResolvedValueOnce({});

    const { setCurrentUser } = renderNavBar(currentUser);

    // Find and click the sign out link
    const signOutLink = screen.getByText(/sign out/i);
    fireEvent.click(signOutLink);

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("dj-rest-auth/logout/");
      expect(setCurrentUser).toHaveBeenCalledWith(null);
    });
  });
});