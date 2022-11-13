import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const searchQuery = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/videos/search${searchQuery}`);
        setVideos((prev) => res.data.videos);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.error || "Error while fetching search videos",
        });
      }
    };

    fetchVideos();
  }, [searchQuery]);

  return (
    <Container>
      {videos.length > 0 &&
        videos.map((video) => <Card key={video._id} video={video} />)}
    </Container>
  );
};

export default Search;
