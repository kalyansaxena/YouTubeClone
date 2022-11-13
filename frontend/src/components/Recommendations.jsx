import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { axiosInstance } from "../utils/axiosConfig";
import Card from "./Card";
import Swal from "sweetalert2";
import {
  fetchRecommendationsError,
  fetchRecommendationsStart,
  fetchRecommendationsSuccess,
} from "../redux/recommendationsSlice";

const Recommendation = styled.div`
  flex: 5;
`;

const Recommendations = ({ tags }) => {
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.recommendations);

  useEffect(() => {
    const fetchVideos = async () => {
      dispatch(fetchRecommendationsStart());
      try {
        const res = await axiosInstance.get(`/videos/tags?tags=${tags}`);
        dispatch(fetchRecommendationsSuccess(res.data.videos));
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error || "Error fetching recommendations",
        });
        dispatch(fetchRecommendationsError());
      }
    };

    fetchVideos();
  }, [dispatch, tags]);

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
