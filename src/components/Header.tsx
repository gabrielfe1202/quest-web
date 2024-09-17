import { useEffect, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Header() {
  const [score, setScore] = useState<number>(0);
  const [ranking, setRanking] = useState<number>(0);
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    httpInstance
      .get(`/UserInfo/${userId}`) // Altere o endpoint conforme necessário
      .then((response) => {
        console.log(response.data);
        setScore(response.data.score);
        setRanking(response.data.ranking);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });  
  }, [userId]);

  return (
    <div
      className="w-full bg-gray-800 text-white py-4 px-8 flex justify-between items-center "
      style={{
        height: "10vh",
      }}
    >
      <div className="text-lg font-semibold flex flex-row">
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="mr-6 hover:text-purple-600"
            style={{ fontSize: 30 }}
          />
        </button>
        <img src="/src/assets/ampacet-logo.png" className="w-9/12" />
      </div>
      <div className="flex flex-row gap-10">
        <div className="flex-row hidden md:flex gap-6">
          <div className="bg-yellow-200 flex flex-row justify-between p-2 rounded-full">
            <p className="mx-8 font-bold text-3xl text-amber-500">{ranking}º</p>
            <img src="/src/assets/trophy.webp" style={{ height: 35 }} />
          </div>
          <div className="bg-yellow-200 flex flex-row justify-between p-2 rounded-full">
            <p className="mx-8 font-bold text-3xl text-amber-500">{score}</p>
            <img src="/src/assets/coin.png" style={{ height: 35 }} />
          </div>
        </div>
        <div>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 rounded-full bg-purple-600 focus:outline-none"
            >
              <FontAwesomeIcon icon={faUser} style={{ fontSize: 26 }} />
            </button>

            <Transition
              show={isOpen}
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-5 w-48 border-0 rounded-md shadow-lg z-20 bg-gray-800 text-white">
                <div className="py-2">
                  <button
                    onClick={() => {}}
                    className="block px-4 py-2 w-full text-white border-white"
                    style={{ borderBottom: "1px solid #fff" }}
                  >
                    Perfil
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem("userId")
                      navigate("/login");
                    }}
                    className="block px-4 py-2 w-full text-white"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
