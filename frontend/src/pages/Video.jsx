import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Comments from "../components/Comments";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dislike,
  fetchVideoError,
  fetchVideoStart,
  fetchVideoSuccess,
  like,
} from "../redux/videoSlice";
import { formatDistanceToNow } from "date-fns";
import { subscription } from "../redux/userSlice";
import Recommendations from "../components/Recommendations";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";

const Container = styled.div`
  display: flex;
  gap: 1rem;
`;

const Content = styled.div`
  flex: 7;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.softHr};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const ChannelImg = styled.img`
  flex: 1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const ChannelDetail = styled.div`
  flex: 11;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const VideoDescription = styled.p`
  font-size: 14px;
`;

const SubsribeButton = styled.button`
  background-color: ${(props) =>
    props.isSub ? "rgba(255, 255, 255, 0.1)" : "#cc1a00"};
  font-weight: 500;
  color: white;
  height: max-content;
  border: none;
  border-radius: 3px;
  padding: 10px 20px;
  cursor: pointer;
`;

const Video = () => {
  const dispatch = useDispatch();
  const videoId = useLocation().pathname.split("/")[2];
  const { currentVideo } = useSelector((state) => state.video);
  const { loggedInUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const addView = async () => {
      try {
        await axiosInstance.put(`/videos/view/${videoId}`);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchChannel = async () => {
      try {
        const res = await axiosInstance.get(`/users/${currentVideo?.userId}`);
        setChannel((prev) => res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVideo = async () => {
      dispatch(fetchVideoStart());
      try {
        const res = await axiosInstance.get(`/videos/${videoId}`);
        console.log(res.data);
        dispatch(fetchVideoSuccess(res.data.video));
        fetchChannel();
      } catch (error) {
        dispatch(fetchVideoError());
        console.log(error);
      }
    };

    addView();
    fetchVideo();
  }, [videoId, dispatch, currentVideo?.userId]);

  const handleLike = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sign In required!",
      });
      return;
    }
    try {
      await axiosInstance.put(`/users/like/${currentVideo?._id}`);
      dispatch(like(loggedInUser?._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sign In required!",
      });
      return;
    }
    try {
      await axiosInstance.put(`/users/dislike/${currentVideo?._id}`);
      dispatch(dislike(loggedInUser?._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscription = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sign In required!",
      });
      return;
    }
    try {
      loggedInUser.subscribedUsers.includes(channel?._id)
        ? await axiosInstance.put(`/users/unsub/${channel?._id}`)
        : await axiosInstance.put(`/users/sub/${channel?._id}`);
      dispatch(subscription(channel?._id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <iframe
            width="600"
            height="315"
            src={currentVideo?.videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </VideoWrapper>
        <Title>{currentVideo && currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo && currentVideo.views} views •{" "}
            {currentVideo &&
              formatDistanceToNow(new Date(currentVideo.createdAt), {
                addSuffix: true,
              })}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo &&
              currentVideo.likes?.includes(loggedInUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo && currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo &&
              currentVideo.dislikes?.includes(loggedInUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              Dislike
            </Button>
            <Button>
              <ShareOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <ChannelImg src={channel?.img} />
            <ChannelDetail>
              <ChannelName>{channel?.name}</ChannelName>
              <ChannelCounter>
                {channel?.subscribers} Subscribers
              </ChannelCounter>
              <VideoDescription>
                {currentVideo && currentVideo.description}
              </VideoDescription>
            </ChannelDetail>
          </ChannelInfo>
          <SubsribeButton
            onClick={handleSubscription}
            isSub={
              loggedInUser &&
              loggedInUser.subscribedUsers?.includes(channel?._id)
                ? true
                : false
            }
          >
            {loggedInUser &&
            loggedInUser.subscribedUsers?.includes(channel?._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </SubsribeButton>
        </Channel>
        <Hr />
        {currentVideo && (
          <Comments videoId={currentVideo._id} loggedInUser={loggedInUser} />
        )}
      </Content>
      {currentVideo && <Recommendations tags={currentVideo.tags} />}
    </Container>
  );
};

export default Video;
