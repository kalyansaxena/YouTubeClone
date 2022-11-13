import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchVideosError,
  fetchSearchVideosStart,
  fetchSearchVideosSuccess,
} from "../redux/searchVideosSlice";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Search = () => {
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.searchVideos);
  const searchQuery = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      dispatch(fetchSearchVideosStart());
      try {
        const res = await axiosInstance.get(`/videos/search${searchQuery}`);
        dispatch(fetchSearchVideosSuccess(res.data.videos));
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.error || "Error while fetching search videos",
        });
        dispatch(fetchSearchVideosError());
      }
    };

    fetchVideos();
  }, [dispatch, searchQuery]);

  return (
    <Container>
      {videos.length > 0 &&
        videos.map((video) => <Card key={video._id} video={video} />)}
    </Container>
  );
};

export default Search;
