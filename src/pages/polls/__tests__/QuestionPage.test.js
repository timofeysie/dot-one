import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import QuestionPage from "../QuestionPage";
import { axiosReq } from "../../../api/axiosDefaults";

jest.mock('../../../api/axiosDefaults', () => ({
  axiosReq: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  }
}));

const mockQuestion = {
  id: '1',
  text: "What's the best tomato variety?",
  owner_username: "Froda",
  created_at: "2021-04-18T12:34:56Z",
  answers: [
    { id: 1, text: "Cherry", votes_count: 5 },
    { id: 2, text: "Heirloom", votes_count: 3 }
  ],
};

jest.mock('../../../api/axiosDefaults', () => ({
  axiosReq: {
    get: jest.fn()
  }
}));

describe('QuestionPage', () => {
  beforeEach(() => {
    axiosReq.get.mockResolvedValue({ data: mockQuestion });
  });

  test('fetches and displays question and answers', async () => {
    render(<Router history={createMemoryHistory()}><QuestionPage /></Router>);

    await waitFor(() => {
      expect(screen.getByText("What's the best tomato variety?")).toBeInTheDocument();
      expect(screen.getByText("Cherry")).toBeInTheDocument();
      expect(screen.getByText("Heirloom")).toBeInTheDocument();
    });
  });
});