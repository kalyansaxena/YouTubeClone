import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Recommendation = styled.div`
  flex: 5;
`;

const Recommendations = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/tags?tags=${tags}`);
        setVideos((prev) => res.data.videos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, [tags]);

  return (
    <Recommendation>
      {videos.length > 0 &&
        videos.map((video) => (
          <Card type="recommendations" key={video._id} video={video} />
        ))}
    </Recommendation>
  );
};

export default Recommendations;
