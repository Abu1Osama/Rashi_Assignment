import ReactPlayer from "react-player";
import Loader from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";
import axios from "axios";

function Reel() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [data, setData] = useState([]);
  const [reelindex, setReelindex] = useState(0);

  // console.log(movies);
  console.log(data)
  async function fetchData() {
    const url = `http://localhost:3001/posts/videos/stream`;

    try {
      const response = await axios.get(url);

      console.log(response.data.docs);

      setData(response.data.docs);
      if (response.data.docs.length > 1) {
        setReelindex(0);
        setIsLoading(false);
        console.log("first");
        console.log(response.data.docs[reelindex].media[0].filename);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handlers = useSwipeable({
    onSwipedUp: () => handleSwipe("up"),
    onSwipedDown: () => handleSwipe("down"),
  });

  const handleSwipe = (direction) => {
    if (data.length > 0) {
      let newIndex;

      if (direction === "up") {
        newIndex = (reelindex - 1 + data.length) % data.length;
      } else if (direction === "down") {
        newIndex = (reelindex + 1) % data.length;
      }

      setReelindex(newIndex);
      setIsPlaying(true);
    }
  };
  const playNextVideo = () => {
    if (data.length > 1) {
      setReelindex((prevIndex) => (prevIndex + 1) % data.length);
      setIsPlaying(true);
    }
  };

  const playprevVideo = () => {
    if (data.length > 1) {
      setReelindex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
      setIsPlaying(true);
    }
  };
  return (
    <div
      className="relative w-96 m-auto mt-5"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        height: "650px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="video-section p-4" {...handlers}>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="player relative rounded-xl pt-[56.25%]">
            <div>
              <ReactPlayer
                preload="auto"
                url={`../assets/media/${data[reelindex].media[0].filename}`}
                width="350px"
                height="600px"
                playing={isPlaying}
                // playing={true}
                controls={true}
                className="react-player absolute top-0 left-0"
                onEnded={playNextVideo}
              />
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-20 right-0 flex flex-col justify-center items-center p-5">
        <button className="z-50">
          <FontAwesomeIcon
            onClick={playprevVideo}
            icon={faArrowUp}
            className="p-5  border-stone-700 rounded-full bg-[#232d2d] hover:text-lime-400 hover:bg-cyan-600"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          />
        </button>
        <button className="z-50">
          <FontAwesomeIcon
            onClick={playNextVideo}
            icon={faArrowDown}
            className="p-5  border-stone-700 rounded-full bg-[#232d2d]  hover:text-lime-400  hover:bg-cyan-600"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          />
        </button>
      </div>
    </div>
  );
}
export default Reel;
