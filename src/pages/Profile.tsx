import { useEffect, useState } from "react";
import Header from "../components/Header";
import { httpInstance } from "../services/httpRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export function Profile() {
  const [score, setScore] = useState<number>(0);
  const [ranking, setRanking] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    httpInstance
      .get(`/UserInfo/${userId}`) // Altere o endpoint conforme necessário
      .then((response) => {
        console.log(response.data);
        setScore(response.data.score);
        setRanking(response.data.ranking);
        setUserName(response.data.userInfos.userName)
        setUserEmail(response.data.userInfos.userEmail)
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, [userId]);

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
          <div className="flex flex-col justify-center items-center gap-10">
            <div              
              className="w-24 h-24 rounded-full bg-purple-600 focus:outline-none flex justify-center items-center text-white"
            >
              <FontAwesomeIcon icon={faUser} style={{ fontSize: 56 }} />
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-bold">Nome: {userName}</p>
              <p className="text-white text-xl font-bold">Email: {userEmail}</p>
            </div>
            <div className="flex-col sm:flex-row flex gap-6">
              <div className="bg-yellow-200 flex flex-row justify-between p-2 rounded-full">
                <p className="mx-8 font-bold text-3xl text-amber-500">
                  {ranking}º
                </p>
                <img src="/src/assets/trophy.webp" style={{ height: 35 }} alt=""/>
              </div>
              <div className="bg-yellow-200 flex flex-row justify-between p-2 rounded-full">
                <p className="mx-8 font-bold text-3xl text-amber-500">
                  {score}
                </p>
                <img src="/src/assets/coin.png" style={{ height: 35 }} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
