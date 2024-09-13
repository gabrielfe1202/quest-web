import { useEffect, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

type LevelParams = {
  id: string;
};

function Level() {
  const { id } = useParams<LevelParams>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    httpInstance
      .get(`/Questions/${id}`) // Altere o endpoint conforme necessário
      .then((response) => {
        console.log(response.data);
        setQuestions(response.data.questions);
        setOptions(response.data.options);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  function nextQuestion() {
    if (selectedOption != "") {
      const quest = questions[currentQuestion];
      responses.push({
        question: quest.id,
        option: selectedOption,
        user: userId,
      });
      console.log(responses);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      alert("escolha uma opção");
    }
  }

  function levelFinished() {
    responses.map((item: any, index) => {
      console.log(item);
      httpInstance
        .post(`/Responses`, item) // Altere o endpoint conforme necessário
        .then((response) => {
          console.log(response.data);
          if (index + 1 === responses.length) {
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
        });
    });
  }

  function multipleOptionChange(id: string){
    if(selectedOptions.filter(x => x == id).length != 0){
        setSelectedOptions(selectedOptions.filter(x => x != id))
    }else{
        selectedOptions.push(id)
    }     
  }

  if (currentQuestion + 1 <= questions.length) {
    return (
      <>
        <div
          className="min-h-screen bg-gray-100 flex items-center justify-start flex-col bg-gray-600"
          style={{
            background: "url(/src/assets/back.jpg)",
            backgroundSize: "cover",
          }}
        >
          <Header />
          <div
            className="flex items-center justify-center mt-10 "
            style={{
              width: "100%",
            }}
          >
            {questions.length > 0 && (
              <div
                className="flex flex-col items-center p-4 bg-gray-700"
                style={{
                  minHeight: "70vh",
                  maxWidth: "500px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <div className="text-3xl font-semibold mb-6 text-white text-center">
                  {questions[currentQuestion].title}
                </div>
                <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                  {options
                    .filter(
                      (x) => x.questionId == questions[currentQuestion].id
                    )
                    .map((op) => {
                      if (questions[currentQuestion].type === "multipeOption") {
                        return(
                            <div
                            onClick={() => {
                              multipleOptionChange(op.id)
                            }}
                            className={`py-3 px-6 rounded-lg border txt-lg text-white text-center ${
                                selectedOptions.filter(x => x == op.id).length != 0
                                ? " border-solid border-2 border-purple-600"
                                : ""
                            }`}
                          >
                            {op.title}
                          </div>
                        )
                      } else {
                        return (
                          <div
                            onClick={() => {
                              setSelectedOption(op.id);
                            }}
                            className={`py-3 px-6 rounded-lg border txt-lg text-white text-center ${
                              selectedOption === op.id
                                ? " border-solid border-2 border-purple-600"
                                : ""
                            }`}
                          >
                            {op.title}
                          </div>
                        );
                      }
                    })}
                </div>

                <button
                  onClick={() => {
                    nextQuestion();
                  }}
                  className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                >
                  Proxima pergunta
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className="min-h-screen bg-gray-100 flex items-center justify-start flex-col bg-gray-600"
          style={{
            background: "url(/src/assets/back.jpg)",
            backgroundSize: "cover",
          }}
        >
          <Header />
          <div
            className="flex items-center justify-center mt-10 "
            style={{
              height: "80vh",
              overflow: "auto",
              width: "100%",
            }}
          >
            <div
              className="flex flex-col items-center p-4 bg-gray-700"
              style={{
                minHeight: "70vh",
                maxWidth: "500px",
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <div className="text-3xl font-semibold mb-6 text-white text-center">
                Final
              </div>
              <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                <p className="text-lg text-white text-center">
                  Ao finalizar você não poderá mais as suas respostas.
                  <br />
                  Confirme no botão abaixo para finalizar
                </p>
              </div>

              <button
                onClick={() => {
                  levelFinished();
                }}
                className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Level;
