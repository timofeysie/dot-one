import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useRedirect } from "../../hooks/useRedirect";
import { axiosReq } from "../../api/axiosDefaults";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

const QuestionForm = () => {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});
  const [questionData, setQuestionData] = useState({
    questionText: "",
    answers: [""]
  });
  const history = useHistory();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "questionText") {
      setQuestionData(prev => ({ ...prev, questionText: value }));
    } else {
      const index = parseInt(name.split("-")[1], 10);
      const newAnswers = [...questionData.answers];
      newAnswers[index] = value;
      setQuestionData(prev => ({ ...prev, answers: newAnswers }));
    }
  };

  const addAnswer = () => {
    setQuestionData(prev => ({
      ...prev,
      answers: [...prev.answers, ""],
    }));
  };

  const removeAnswer = () => {
    if (questionData.answers.length > 1) {
      setQuestionData(prev => ({
        ...prev,
        answers: prev.answers.slice(0, -1)
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { questionText, answers } = questionData;
    const newErrors = {};

    if (!questionText.trim()) {
      newErrors.questionText = ["The question cannot be left blank."];
    }

    let answerErrors = false;
    answers.forEach((answer, index) => {
      if (!answer.trim()) {
        newErrors[`answer-${index}`] = "Answer cannot be left blank.";
        answerErrors = true;
      }
    });

    if (answers.length < 2 || answerErrors) {
      newErrors.answers = "At least two answers are required and none can be left blank.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = {
        text: questionText,
        answers: answers.map(answer => ({ text: answer.trim() }))
      };
      const { data } = await axiosReq.post("/questions/", formData);
      history.push(`/questions/${data.id}`);
    } catch (err) {
      // console.log(err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={12} lg={12}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-start pt-4`}
          >
            <Col className="mx-auto" lg={8}>
            <Form.Group>
              <Form.Label htmlFor="question">Question</Form.Label>
              <Form.Control
                type="text"
                name="questionText"
                id="question"
                value={questionData.questionText}
                onChange={handleChange}
                placeholder="Enter your question"
                isInvalid={!!errors.questionText}
              />
              {errors.questionText && (
                <Alert className="mt-1" variant="warning">{errors.questionText}</Alert>
              )}
            </Form.Group>

            {errors.answers && (
              <Alert className="mt-1" variant="warning">{errors.answers}</Alert>
            )}

          {questionData.answers.map((answer, index) => (
            <Form.Group key={`answer-${index}`}>
              <Form.Label htmlFor={`answer-${index}`}>Answer {index + 1}</Form.Label>
              <Form.Control
                type="text"
                name={`answer-${index}`}
                id={`answer-${index}`}
                value={answer}
                onChange={handleChange}
                placeholder="Enter an answer option"
                isInvalid={!!errors[`answer-${index}`]}
              />
              {errors[`answer-${index}`] && (
                <Alert className="mt-1" variant="warning">{errors[`answer-${index}`]}</Alert>
              )}
            </Form.Group>
          ))}

            <Button onClick={addAnswer} aria-label="Add answer" className={`${btnStyles.AddAnswer} mt-2 mr-2`}>
              <i className="fa-regular fa-square-plus" />
            </Button>
            {questionData.answers.length > 1 && (
              <Button onClick={removeAnswer} aria-label="Remove answer" className={`${btnStyles.AddAnswer} mt-2`}>
                <i className="fa-regular fa-square-minus" />
              </Button>
            )}
            </Col>
            <div className="d-flex justify-content-center">
              <Button
                className={`${btnStyles.CancelBtn} px-3 py-2 mt-3 mx-2`}
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
              <Button
                className={`${btnStyles.SubmitBtn} px-3 py-2 mt-3 mx-2`}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default QuestionForm;
