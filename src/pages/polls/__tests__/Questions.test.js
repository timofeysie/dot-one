import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Questions from "../Questions";
import { axiosReq } from "../../../api/axiosDefaults";

jest.mock("../../../api/axiosDefaults");
jest.mock("../../../contexts/CurrentUserContext", () => ({
  useCurrentUser: () => ({
    currentUser: { username: "user1" }
  })
}));
jest.mock("lottie-react", () => {
  return {
    __esModule: true,
    default: () => <div>Mocked Lottie Animation</div>,
  };
});

const mockQuestionsData = {
  results: [
    {
      id: 1,
      text: "What's the best tomato variety?",
      owner_username: "user1",
      created_at: "2021-04-18T12:34:56Z",
      answers: [
        { id: 1, text: "Cherry", votes_count: 10 },
        { id: 2, text: "Heirloom", votes_count: 5 }
      ],
    }
  ],
  next: null
};

describe("Questions", () => {
  beforeEach(() => {
    axiosReq.get.mockResolvedValue({ data: mockQuestionsData });
  });

  test("fetches and displays questions on initial load", async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Questions />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("What's the best tomato variety?")).toBeInTheDocument();
    });
  });

  test("allows adding a question", () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Questions />
      </Router>
    );

    fireEvent.click(screen.getByText("Add question"));
    expect(history.location.pathname).toBe("/questions/create");
  });

  test("toggles viewing results", async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Questions />
      </Router>
    );
  
    const resultsButton = await screen.findByText("See results");
    fireEvent.click(resultsButton);
  
    await screen.findByText("Hide results");
    expect(screen.getByText("10 votes")).toBeInTheDocument();
  });

  test("search functionality triggers re-fetching of questions", async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Questions />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText("Search questions");
    fireEvent.change(searchInput, { target: { value: 'tomato' } });

    await waitFor(() => {
      expect(axiosReq.get).toHaveBeenCalledWith(expect.stringContaining("search=tomato"));
    });
  });
});
