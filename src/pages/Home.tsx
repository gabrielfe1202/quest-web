import { useEffect, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";

class level {
  public completed: boolean;
  constructor(public title: string, public order: number, public id: string) {
    this.completed = false;
  }
}

function Home() {
  const [levels, setLevels] = useState<level[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    httpInstance
      .get(`/Level/${userId}`) // Altere o endpoint conforme necessário
      .then((response) => {
        console.log(response.data);
        setLevels(response.data.Levels);
        setCompletions(response.data.Completions);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });

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
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-start flex-col bg-gray-600" style={{
        background: 'url(/src/assets/back.jpg)',
        backgroundSize: 'cover'
        }}>
        <Header />
        <div className="flex items-center justify-center mt-10 " style={{
            height: '80vh',
            overflow: "auto",
            width: '100%'
        }}>
          <div className="flex flex-col items-center space-y-8 mt-10" style={{paddingTop: 200}}>
            {levels.map((item, index) => {
              console.log("item: ", item);
              return (
                <>
                  <div style={{ position: "relative" }}>
                    <img src="/src/assets/ilha.png" />
                    <div
                      className=""
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 0,
                      }}
                    >
                      <h2 style={{
                        color: '#fff',
                        fontSize: 33,
                        fontWeight: "bold",
                        textShadow: 'black 3px 3px 10px'                        
                      }}>{item.title}</h2>
                      {completions.filter((x) => x.levelId === item.id).length >
                      0 ? (
                        <div className="level-check text-green-600">                          
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                      ) : (
                        <>
                          {index > 0 ? (
                            completions.filter(
                              (x) => x.levelId === levels[index - 1]?.id
                            ).length > 0 ? (                            
                                <button
                                  onClick={() => navigate(`/level/${item.id}`)}
                                  className="btn-game bg-purple-800"
                                >
                                  Jogar
                                </button>                              
                            ) : (
                            <div className="level-check text-red-950" style={{fontSize: '20px'}}>      
                                <FontAwesomeIcon icon={faLock} />
                              </div>
                            )
                          ) : (
                            <button
                                onClick={() => navigate(`/level/${item.id}`)}
                                className="btn-game bg-purple-800"
                            >
                                  Jogar
                            </button>   
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
