import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
  }
}

export function Introduction() {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        // Vídeo terminou, mostra o botão
        setIsButtonVisible(true);
      }
    };

    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "390",
        width: "640",
        videoId: "P39f0_aYv-Y", // Substitua com o ID do seu vídeo
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onload = () => {
      onYouTubeIframeAPIReady();
    };
    document.body.appendChild(script);

    // Limpeza: remove o script do YouTube quando o componente é desmontado
    return () => {
      document.body.removeChild(script);
    };
  }, []); 

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-start flex-col bg-gray-600"
        style={{
          background: "url(/src/assets/sky3.jpg)",
          backgroundSize: "cover",
          backgroundPositionX: "center",
          backgroundPositionY: "top",
        }}
      >
        <Header />

        <div></div>

        <div
          className="flex flex-col mt-12 items-center w-11/12 p-4 bg-gray-700 mb-12 lg:w-8/12"
          style={{
            minHeight: "70vh",
          }}
        >
          <div id="player"></div>

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

          {isButtonVisible && (
            <div className="w-full px-12 mt-5">
              <button
                onClick={() => navigate("/")}
                className="bg-purple-600 px-12 py-3 rounded-lg text-white text-xl font-bold float-end"
              >
                Começar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
