import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import QuestionForm from "../QuestionForm";
import { axiosReq } from "../../../api/axiosDefaults";
import MockAdapter from "axios-mock-adapter";
import { useHistory } from "react-router-dom";

jest.mock("../../../api/axiosDefaults");
jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));
jest.mock("../../../hooks/useRedirect");

describe("QuestionForm", () => {
  const axiosMock = new MockAdapter(axiosReq);
  const mockHistoryPush = jest.fn();

  beforeEach(() => {
    useHistory.mockReturnValue({ push: mockHistoryPush });
    axiosMock.reset();
  });

  it("displays validation errors for empty inputs", async () => {
    const { getByRole, findByText } = render(<QuestionForm />);
    fireEvent.click(getByRole('button', { name: /submit/i }));
    await findByText("The question cannot be left blank.");
    await findByText("At least two answers are required and none can be left blank.");
  });

  it("allows adding and removing answer fields", () => {
    const { getByRole, getAllByPlaceholderText } = render(<QuestionForm />);
    fireEvent.click(getByRole('button', { name: /add answer/i }));
    let answerInputs = getAllByPlaceholderText("Enter an answer option");
    expect(answerInputs.length).toBe(2);

    fireEvent.click(getByRole('button', { name: /remove answer/i }));
    answerInputs = getAllByPlaceholderText("Enter an answer option");
    expect(answerInputs.length).toBe(1);
  });
});
