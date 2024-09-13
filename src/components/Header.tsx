import { useEffect, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";

function Header() {
  const [score, setScore] = useState<number>(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    httpInstance
      .get(`/UserInfo/${userId}`) // Altere o endpoint conforme necessário
      .then((response) => {
        console.log(response.data);
        setScore(response.data.score);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  return (
    <div
      className="w-full bg-gray-800 text-white py-4 px-8 flex justify-between items-center"
      style={{
        height: "10vh",
      }}
    >
      <div className="text-lg font-semibold">Jogo de Níveis</div>
      <div className="text-lg">
        Pontos do Jogador: <span className="font-bold">{score}</span>
      </div>
    </div>
  );
}

export default Header;
