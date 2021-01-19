import React, { useState } from 'react';
import { useRouter } from 'next/router';
import TextField from '@material-ui/core/TextField';

import * as gtag from 'lib/gtag';
import Layout from 'components/layout';
import { createReasonForPost } from 'apis/posts.api';

import useStyles from 'components/modal/modal.styles';

const ADD_REASON_EVENT = {
  label: 'add-reason',
  action: 'click',
  category: 'ab-testing',
};

export default function ReasonCreate() {
  const classes = useStyles();
  const router = useRouter();
  const { pid } = router.query;

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  const handleAddReason = async (e) => {
    e.preventDefault();

    gtag.event(ADD_REASON_EVENT);
    await createReasonForPost({ postID: pid, title, description });
    router.push(`/posts/${pid}`);
  };

  return (
    <Layout>
      <h2>Add Reason</h2>
      <form noValidate autoComplete="off" onSubmit={handleAddReason}>
        <div>
          <TextField
            fullWidth
            label="Title"
            multiline
            rows={3}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={classes.actionsRoot}>
          <button
            className={classes.cancelButton}
            onClick={() => router.push(`/posts/${pid}`)}
            type="button"
          >
            CANCEL
          </button>
          <input
            className={classes.createButton}
            type="submit"
            value="CREATE"
          />
        </div>
      </form>
    </Layout>
  );
}
