import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: ${({ theme }) => theme.text};
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.softHr};
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  outline: none;
`;

const EmptyCommentsText = styled.span``;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 5px;
`;

const Comments = ({ videoId, loggedInUser }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [toggleCommentButtons, settoggleCommentButtons] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        console.log(res.data);
        setComments((prev) => res.data.comments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleCommentSubmission = async (e) => {
    console.log(newCommentText);
    if (!loggedInUser) {
      alert("Please signin first");
      settoggleCommentButtons((prev) => false);
      return;
    }
    try {
      const res = await axios.post(`/comments`, {
        videoId,
        description: newCommentText,
      });
      console.log(res.data);
      setComments((prev) => [...prev, res.data.comment]);
      setNewCommentText("");
      settoggleCommentButtons((prev) => false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = (e) => {
    setNewCommentText("");
    settoggleCommentButtons((prev) => false);
  };

  return (
    <Container>
      {loggedInUser && (
        <NewComment>
          <Avatar src={loggedInUser?.img} />
          <Input
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={(e) => settoggleCommentButtons((prev) => true)}
            // onBlur={(e) => settoggleCommentButtons((prev) => false)}
          />
        </NewComment>
      )}

      <ButtonsContainer style={{ display: !toggleCommentButtons && "none" }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleCommentSubmission}>Comment</Button>
      </ButtonsContainer>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))
      ) : (
        <EmptyCommentsText>No Comments for this video</EmptyCommentsText>
      )}
    </Container>
  );
};

export default Comments;
