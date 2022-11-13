import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { axiosInstance } from "../utils/axiosConfig";
import Card from "./Card";
import Swal from "sweetalert2";

const Recommendation = styled.div`
  flex: 5;
`;

const Recommendations = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/videos/tags?tags=${tags}`);
        setVideos((prev) => res.data.videos);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error || "Error fetching recommendations",
        });
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
