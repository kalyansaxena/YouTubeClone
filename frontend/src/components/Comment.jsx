import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { axiosInstance } from "../utils/axiosConfig";

const Container = styled.div`
  display: flex;
  gap: 20px;
  margin: 10px 0px;
`;

const Avatar = styled.img`
  flex: 0.8;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const CommentDetails = styled.div`
  flex: 11.2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;
const DateContainer = styled.span`
  font-size: 12px;
  font-weight: 400;
  margin-left: 5px;
  color: ${({ theme }) => theme.textSoft};
`;
const CommentText = styled.span`
  font-size: 14px;
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axiosInstance.get(`/users/${comment?.userId}`);
        setChannel((prev) => res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChannel();
  }, [comment?.userId]);

  return (
    <Container>
      <Avatar src={channel?.img} />
      <CommentDetails>
        <Name>
          {channel?.name}{" "}
          <DateContainer>
            {formatDistanceToNow(new Date(comment?.createdAt), {
              addSuffix: true,
            })}
          </DateContainer>
        </Name>
        <CommentText>{comment?.description}</CommentText>
      </CommentDetails>
    </Container>
  );
};

export default Comment;
