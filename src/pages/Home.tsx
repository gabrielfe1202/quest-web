import { useEffect, useRef, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from "../components/Header";

class level {
  public completed: boolean;
  iconImage: string | undefined;
  constructor(public title: string, public order: number, public id: string) {
    this.completed = false;
  }
}

function Home() {
  const [levels, setLevels] = useState<level[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [completions, setCompletions] = useState<any[]>([]);
  const userId = localStorage.getItem("userId");
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const div = divRef.current;

    const user = localStorage.getItem('userId');
    console.log(user)
    if (user === null) {      
      navigate("/login")
    }

    httpInstance
      .get(`/Level/${userId}`) 
      .then((response) => {
        setLevels(response.data.Levels);
        setCompletions(response.data.Completions);
        if (div) {
          div.scrollTop = div.scrollHeight;
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });

  }, [navigate, userId]);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.scrollTop = div.scrollHeight;
    }
  })

  return (
    <>
      <div className="min-h-screen flex items-center justify-start flex-col bg-gray-600" style={{
        background: "url(/src/assets/sky3.jpg)",
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
        backgroundPositionY: 'top'
      }}>
        <Header />
        <div
          ref={divRef}
          className="flex items-center justify-center mt-10 "
          style={{
            height: '90vh',
            overflow: "auto",
            width: '100%',
            margin: 0
          }}>
          <div className="flex flex-col items-center space-y-8 mt-10 listLevel" style={{ height: `90vh` }}>
            {levels.map((item, index) => {
              console.log("item: ", item);
              return (
                <>
                  <div style={{ position: "relative", marginTop: 0 }} className="listLevelItem">
                    <img
                      src={item.iconImage}
                      style={{
                        filter: 'drop-shadow(1px 3px 15px #505050)'
                      }}
                    />
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
                          {item.order > 1 ? (
                            completions.filter(
                              (x) => x.levelId === levels[index + 1]?.id
                            ).length > 0 ? (
                              <button
                                onClick={() => navigate(`/level/${item.id}`)}
                                className="btn-game bg-purple-800"
                              >
                                Jogar
                              </button>
                            ) : (
                              <div className="level-check text-red-950" style={{ fontSize: '20px' }}>
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
