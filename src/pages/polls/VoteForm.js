/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { axiosReq } from "../../api/axiosDefaults";
import CloseModal from "../../components/CloseModal";

import btnStyles from "../../styles/Button.module.css";

const VoteForm = ({ questionId, selectedAnswerId, onVoteSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: ""
  });

  const handleSubmit = async () => {
    if (!selectedAnswerId) {
      setModalContent({
        title: "Selection required",
        message: "Please select an answer before voting."
      });
      setShowModal(true);
      return;
    }

    try {
      await axiosReq.post("/votes/", { answer: selectedAnswerId });
      onVoteSuccess(questionId, selectedAnswerId);
      setModalContent({
        title: "Bam! Your vote just landed!",
        message: "Cheers to you for casting your vote! You've spiced up the poll!"
      });
      setShowModal(true);
    } catch (err) {
      // console.error("Error submitting vote:", err);
      if (err.response && err.response.data) {
        setModalContent({
          title: "Voting error",
          message: "Oops! Our vote-o-meter says you've already hit the button. No double-dipping allowed!"
        });
        setShowModal(true);
      }
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Button 
        disabled={!selectedAnswerId}
        className={`${selectedAnswerId ? btnStyles.StandardBtn : btnStyles.VoteDisabled} mt-3`}
        onClick={handleSubmit} 
      >
        Submit
      </Button>
      <CloseModal
        show={showModal}
        title={modalContent.title}
        message={modalContent.message}
        handleClose={handleClose}
      />
    </div>
  );
}

export default VoteForm;
