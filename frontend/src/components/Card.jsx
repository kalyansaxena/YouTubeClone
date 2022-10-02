import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const Container = styled.div`
  width: ${(props) => (props.type === "recommendations" ? "100%" : "300px")};
  display: ${(props) => props.type === "recommendations" && "flex"};
  margin-bottom: ${(props) =>
    props.type === "recommendations" ? "10px" : "45px"};
  cursor: pointer;
  gap: ${(props) => props.type === "recommendations" && "10px"};
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "recommendations" ? "150px" : "170px")};
  background-color: #999;
  flex: ${(props) => props.type === "recommendations" && "1"};
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "recommendations" && "16px"};
  gap: 12px;
  flex: ${(props) => props.type === "recommendations" && "1"};
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "recommendations" && "none"};
`;

const VideoMetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.type === "recommendations" ? "start" : "space-between"};
`;
const VideoTitle = styled.h1`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;
const ChannelName = styled.h2`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSoft};
`;
const VideoInfo = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/${video.userId}`);
        setChannel((prev) => res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChannel();
  }, [video.userId]);

  return (
    <Link
      to={`/video/${video._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Container type={type}>
        <Image src={video.imgUrl} type={type} />
        <Details type={type}>
          <ChannelImage src={channel.img} type={type} />
          <VideoMetaInfo type={type}>
            <VideoTitle>{video.title}</VideoTitle>
            <ChannelName>{channel.name}</ChannelName>
            <VideoInfo>
              {video.views} views .{" "}
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </VideoInfo>
          </VideoMetaInfo>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
