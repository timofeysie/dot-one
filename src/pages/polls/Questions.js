/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useHistory } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { QuestionOptionsDropdown } from "../../components/MoreDropdown";
import Answer from "../../components/Answer";
import { fetchMoreData } from "../../utils/utils";
import VoteForm from "./VoteForm";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/Questions.module.css";
import btnStyles from "../../styles/Button.module.css";

const Questions = ({ message = "No questions found." }) => {
  const [questions, setQuestions] = useState({ results: [], next: null });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});

  const history = useHistory();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosReq.get(`/questions/?search=${query}`);
        setQuestions(data);
        setHasLoaded(true);
      } catch (err) {
        // console.error("Failed to fetch questions:", err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectAnswer = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const toggleResults = (questionId) => {
    setShowResults((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  function handleAddQuestion() {
    console.log("handle");
    history.push("/questions/create");
  }

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axiosReq.delete(`/questions/${questionId}`);
      setQuestions((prev) => ({
        ...prev,
        results: prev.results.filter((question) => question.id !== questionId),
      }));
    } catch (error) {
      // console.error("Failed to delete the question:", error);
    }
  };

  const handleVoteSuccess = (questionId, answerId) => {
    setQuestions((prev) => ({
      ...prev,
      results: prev.results.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.map((answer) => {
              if (answer.id === answerId) {
                return { ...answer, votes_count: answer.votes_count + 1 };
              }
              return answer;
            }),
          };
        }
        return question;
      }),
    }));
  };

  let content;

  if (!hasLoaded) {
    content = <Asset spinner />;
  } else if (!questions.results.length) {
    content = <Asset message={message} />;
  } else {
    content = (
      <InfiniteScroll
        dataLength={questions.results.length}
        next={() => fetchMoreData(questions, setQuestions)}
        hasMore={!!questions.next}
        loader={<Asset spinner />}
      >
        {questions.results.map((question) => (
          <Container
            key={question.id}
            className={`mb-4 py-4 px-4 ${appStyles.Content}`}
          >
            {question.owner_username === currentUser.username && (
              <QuestionOptionsDropdown
                handleDelete={() => handleDeleteQuestion(question.id)}
              />
            )}
            <Link to={`/questions/${question.id}`}>
              <h4 className="pr-3">{question.text}</h4>
            </Link>
            <div className="mb-2">
              <small>
                Asked by{" "}
                <Link to={`/profiles/${question.owner}`}>
                  {question.owner_username}
                </Link>
                , at {question.created_at}
              </small>
            </div>
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className="d-flex justify-content-between align-items-center"
              >
                <Answer
                  id={answer.id}
                  text={answer.text}
                  isSelected={selectedAnswers[question.id] === answer.id}
                  onSelectAnswer={() =>
                    handleSelectAnswer(question.id, answer.id)
                  }
                />
                {showResults[question.id] && (
                  <span
                    style={{
                      marginLeft: "10px",
                      minWidth: "70px",
                      textAlign: "right",
                    }}
                  >
                    {answer.votes_count || 0} votes
                  </span>
                )}
              </div>
            ))}
            <div className="d-flex justify-content-between align-items-center">
              <VoteForm
                questionId={question.id}
                selectedAnswerId={selectedAnswers[question.id]}
                onVoteSuccess={() =>
                  handleVoteSuccess(question.id, selectedAnswers[question.id])
                }
              />
              <Button
                variant="link"
                onClick={() => toggleResults(question.id)}
                className="text-muted"
              >
                {showResults[question.id] ? "Hide results" : "See results"}
              </Button>
            </div>
          </Container>
        ))}
      </InfiniteScroll>
    );
  }

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2 mx-auto" lg={8}>
        <div className="d-flex justify-content-center mb-4">
          <Button
            type="button"
            onClick={handleAddQuestion}
            className={btnStyles.StandardBtn}
          >
            <i className="fa-regular fa-square-plus" />
            Add question
          </Button>
        </div>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Label htmlFor="search-questions" className="sr-only">
            Search questions
          </Form.Label>
          <Form.Control
            value={query}
            id="search-questions"
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search questions"
          />
        </Form>
        {content}
      </Col>
    </Row>
  );
};

export default Questions;
