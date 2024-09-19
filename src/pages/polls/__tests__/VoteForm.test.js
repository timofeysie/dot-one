import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import VoteForm from "../VoteForm";
import { axiosReq } from "../../../api/axiosDefaults";
import { act } from "react-dom/test-utils";

jest.mock("../../../api/axiosDefaults");

const mockOnVoteSuccess = jest.fn();

describe("VoteForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits a vote successfully", async () => {
    axiosReq.post.mockResolvedValue({});
    render(<VoteForm questionId="1" selectedAnswerId="42" onVoteSuccess={mockOnVoteSuccess} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(axiosReq.post).toHaveBeenCalledWith("/votes/", { answer: "42" });
    expect(mockOnVoteSuccess).toHaveBeenCalledWith("1", "42");
    expect(screen.getByText("Bam! Your vote just landed!")).toBeInTheDocument();
  });

  test("handles API errors on voting", async () => {
    axiosReq.post.mockRejectedValue({
      response: { data: "Already voted" }
    });
    render(<VoteForm questionId="1" selectedAnswerId="42" onVoteSuccess={mockOnVoteSuccess} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(axiosReq.post).toHaveBeenCalledWith("/votes/", { answer: "42" });
    expect(screen.getByText("Voting error")).toBeInTheDocument();
    expect(screen.getByText("Oops! Our vote-o-meter says you've already hit the button. No double-dipping allowed!")).toBeInTheDocument();
  });

  test("closes modal on close button click", async () => {
    axiosReq.post.mockResolvedValue({});
    render(<VoteForm questionId="1" selectedAnswerId="42" onVoteSuccess={mockOnVoteSuccess} />);
  
    // Triggering the voting process
    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });
  
    // Ensure the modal with the correct message is displayed
    expect(screen.getByText("Bam! Your vote just landed!")).toBeInTheDocument();
  
    // Assuming 'Close' is the text on the close button in CloseModal
    const closeButton = screen.getByText("Close", { selector: 'button' });
    fireEvent.click(closeButton);
  
    // Assert modal is closed by checking if the modal content is not in the document
    await waitFor(() => {
      expect(screen.queryByText("Bam! Your vote just landed!")).not.toBeInTheDocument();
    });
  });
  
});
