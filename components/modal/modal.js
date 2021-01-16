import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

import { createReasonForPost } from 'apis/posts.api';

import useStyles from './modal.styles';

export default function SimpleModal({ open, onClose, postID, onAddReason }) {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReason = await createReasonForPost({ postID, title, description });
    onAddReason(newReason);
    onClose();
  };

  const body = (
    <div className={classes.paper}>
      <h2 className={classes.title}>Add Reason</h2>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div>
          <TextField
            label="Title"
            multiline
            rows={3}
            onChange={(e) => setTitle(e.target.value)}
            className={classes.textField}
          />
        </div>
        <div>
          <TextField
            label="Description"
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            className={classes.textField}
          />
        </div>
        <button className={classes.createButton}>Create</button>
      </form>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
