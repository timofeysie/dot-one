/* eslint-disable react/prop-types */
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import btnStyles from "../styles/Button.module.css";

const CloseModal = ({ show, title, message, handleClose }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button className={btnStyles.StandardBtn} onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

export default CloseModal;