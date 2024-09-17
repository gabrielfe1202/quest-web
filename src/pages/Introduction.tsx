import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import YouTube from "react-youtube";

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    YT: any;
  }
}

export function Introduction() {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const onPlayerStateChange = (event: { data: unknown }) => {
    if (event.data === window.YT.PlayerState.ENDED) {      
      setIsButtonVisible(true);
    }
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-start flex-col bg-gray-600"
        style={{
          background: "url(/sky.jpg)",
          backgroundSize: "cover",
          backgroundPositionX: "center",
          backgroundPositionY: "top",
        }}
      >
        <Header />

        <div
          className="flex flex-col mt-12 items-center w-11/12 py-8 bg-gray-700 mb-12 lg:w-8/12"
          style={{
            minHeight: "70vh",
          }}
        >
          <YouTube
            videoId="P39f0_aYv-Y"
            opts={opts}
            onStateChange={onPlayerStateChange}
          />

          <p className="text-white text-left font-bold w-full text-3xl mt-10 px-12">
            Lorem ipsum dolor
          </p>
          <p className="text-white text-xl mt-4 px-12 w-full">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            dolorem dolores, nam iste molestiae deleniti sunt. Adipisci eaque
            rerum non itaque! Itaque architecto iusto, quaerat et quidem
            praesentium a maiores! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quibusdam dolorem dolores, nam iste molestiae
            deleniti sunt. Adipisci eaque rerum non itaque! Itaque architecto
            iusto, quaerat et quidem praesentium a maiores! Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Quibusdam dolorem dolores,
            nam iste molestiae deleniti sunt. Adipisci eaque rerum non itaque!
            Itaque architecto iusto, quaerat et quidem praesentium a maiores!
          </p>

          <div className="w-full px-12 mt-5">
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 px-12 py-3 rounded-lg text-white text-xl font-bold float-end disabled:opacity-65 disabled:cursor-no-drop  "
              disabled={!isButtonVisible}
            >
              Começar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
