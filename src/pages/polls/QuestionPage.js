import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";

import appStyles from "../../App.module.css";
import Answer from "../../components/Answer";
import VoteForm from "./VoteForm";
import { QuestionOptionsDropdown } from "../../components/MoreDropdown";

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const currentUser = useCurrentUser();
  const history = useHistory();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const { data } = await axiosReq.get(`/questions/${id}`);
        setQuestion(data);
      } catch (err) {
        // console.error("Error fetching question:", err);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleVoteSuccess = (answerId) => {
    setQuestion(prev => ({
      ...prev,
      answers: prev.answers.map(answer => {
        if (answer.id === answerId) {
          return { ...answer, votes_count: answer.votes_count ? answer.votes_count + 1 : 1 };
        }
        return answer;
      })
    }));
  };

  const handleDeleteQuestion = async () => {
    try {
      await axiosReq.delete(`/questions/${id}`);
      history.push("/questions");
    } catch (err) {
      // console.error("Failed to delete the question:", err);
    }
  };

  const toggleResults = () => {
    setShowResults(prev => !prev);
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2 mx-auto" lg={8}>
        <Container className={`${appStyles.Content} py-4 px-4`}>
          {question && (
            <>
              {currentUser?.username === question.owner_username && (
                <QuestionOptionsDropdown handleDelete={handleDeleteQuestion} />
              )}
              <h4 className="pr-3">{question.text}</h4>
              <div className="mb-2">
                <small>
                  Asked by <Link to={`/profiles/${question.owner}`}>{question.owner_username}</Link>, at {question.created_at}
                </small>
              </div>
              {question.answers.map((answer) => (
                <div key={answer.id} className="d-flex justify-content-between align-items-center">
                  <Answer
                    id={answer.id}
                    text={answer.text}
                    isSelected={selectedAnswerId === answer.id}
                    onSelectAnswer={() => setSelectedAnswerId(answer.id)}
                  />
                  {showResults && <span className="ml-2">{answer.votes_count || 0} votes</span>}
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <VoteForm 
                  questionId={id} 
                  selectedAnswerId={selectedAnswerId}
                  onVoteSuccess={() => handleVoteSuccess(selectedAnswerId)}
                />
                <Button variant="link" onClick={toggleResults} className="text-muted">
                  {showResults ? "Hide results" : "See results"}
                </Button>
              </div>
            </>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default QuestionPage;
