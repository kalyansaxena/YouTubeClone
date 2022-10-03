import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { axiosInstance } from "../utils/axiosConfig";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${type}`);
        setVideos((prev) => res.data.videos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.length > 0 &&
        videos.map((video) => <Card key={video._id} video={video} />)}
    </Container>
  );
};

export default Home;
