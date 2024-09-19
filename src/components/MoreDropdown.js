/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router-dom";
import styles from "../styles/MoreDropdown.module.css";
import ConfirmModal from "./ConfirmModal";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fas fa-ellipsis-v"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    }}
    tabIndex="0"
    role="button"
    aria-label="More options" 
  />
));


export const MoreDropdown = ({ handleEdit, handleDelete }) => (
  <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
    <Dropdown.Toggle as={ThreeDots} />
    <Dropdown.Menu
      popperConfig={{ strategy: "fixed" }}
    >
      <Dropdown.Item
        onClick={handleEdit}
        aria-label="edit"
      >
        <i className="fas fa-edit" /> Edit
      </Dropdown.Item>
      <Dropdown.Item
        onClick={handleDelete}
        aria-label="delete"
      >
        <i className="fas fa-trash-alt" /> Delete
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export const ProfileEditDropdown = ({ id }) => {
  const history = useHistory();
  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit profile"
        >
          <i className="fas fa-edit" /> Edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit username"
        >
          <i className="fa-solid fa-user-pen" /> Change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit password"
        >
          <i className="fa-solid fa-lock" /> Change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const QuestionOptionsDropdown = ({ questionId, handleDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(questionId);
    setShowConfirmModal(false);
  };

  return (
    <>
    <Dropdown className={`ml-auto pr-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu className="text-center" popperConfig={{ strategy: "fixed" }}>
          <Dropdown.Item className={styles.DeleteItem} onClick={handleDeleteClick} aria-label="delete question">
            <i className="fas fa-trash-alt" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ConfirmModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this question?"
        title="Confirm deletion"
      />
    </>
  );
};
