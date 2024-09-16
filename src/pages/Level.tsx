import { useEffect, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

type LevelParams = {
  id: string;
};

function Level() {
  const { id } = useParams<LevelParams>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({ title: '', id: '', type: '', nextContetId: '', nextQuestionId: '', previusContetId: null, previusQuestionId: null });
  const [currentContent, setCurrentContent] = useState({ title: '', text: '', nextQuestionId: '', nextContetId: '', previusContetId: null, previusQuestionId: null });
  const [toggleQuest, setToggleQuest] = useState(true)
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [finished, setFinished] = useState(false)
  const [responses, setResponses] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    httpInstance
      .get(`/Questions/${id}`) // Altere o endpoint conforme necessário
      .then((response) => {
        console.log(response.data);
        setQuestions(response.data.questions);
        setCurrentQuestion(response.data.questions.filter((x: { previusQuestionId: null; previusContetId: null; }) => x.previusQuestionId === null && x.previusContetId == null)[0])
        setOptions(response.data.options);
        setContents(response.data.contents)
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      })

  }, []);

  function nextQuestionFromContent() {
    if (currentContent.nextContetId != null) {
      setCurrentContent(contents.filter(x => x.id == currentContent.nextContetId)[0])
      setToggleQuest(false)
    }
    else if (currentContent.nextQuestionId != null) {
      setCurrentQuestion(questions.filter(x => x.id == currentContent.nextQuestionId)[0])
      setToggleQuest(true)
    }
    else {
      setFinished(true)
    }
  }

  function nextQuestion() {
    function changeQuenstion() {
      if (currentQuestion.nextContetId != null) {
        setCurrentContent(contents.filter(x => x.id == currentQuestion.nextContetId)[0])
        setToggleQuest(false)
      }
      else if (currentQuestion.nextQuestionId != null) {
        setCurrentQuestion(questions.filter(x => x.id == currentQuestion.nextQuestionId)[0])
        setToggleQuest(true)
      }
      else {
        setFinished(true)
      }
    }

    if (currentQuestion.type === "multipeOption") {
      if (selectedOptions.length > 0) {        
        selectedOptions.map((item) => {
          responses.push({
            question: currentQuestion.id,
            option: item,
            user: userId,
          });
        })
        setSelectedOptions([]);
        changeQuenstion()
      }
    } else {
      if (selectedOption != "") {                
        responses.push({
          question: currentQuestion.id,
          option: selectedOption,
          user: userId,
        });
        console.log(responses);
        setSelectedOption("");
        changeQuenstion()
      } else {
        alert("escolha uma opção");
      }
    }
  }


  function previusQuestion() {    
    if (!finished) {
      if (currentQuestion.previusContetId != null) {
        setCurrentContent(contents.filter(x => x.id == currentQuestion.previusContetId)[0])
        setToggleQuest(false)
      }
      else if (currentQuestion.previusQuestionId != null) {
        if(questions.filter(x => x.id == currentQuestion.previusQuestionId)[0].type == "multipeOption"){
          responses.filter(x => x.question != currentQuestion.previusQuestionId).map((item) => {
            console.log(item)
          })
        }else{
          setSelectedOption(responses.filter(x => x.question != currentQuestion.previusQuestionId)[0].option)
        }
        setResponses(responses.filter(x => x.question != currentQuestion.previusQuestionId))
        setCurrentQuestion(questions.filter(x => x.id == currentQuestion.previusQuestionId)[0])
        setToggleQuest(true)
      }
    }else{
      const lastQuest = questions.filter(x => x.nextContetId == null && x.nextQuestionId == null)[0]
      if(lastQuest.type == "multipeOption"){
        responses.filter(x => x.question != currentQuestion.previusQuestionId).map((item) => {
          console.log(item)
        })
      }else{
        setSelectedOption(responses.filter(x => x.question == lastQuest.id)[0].option)
      }
      setResponses(responses.filter(x => x.question != currentQuestion.previusQuestionId))
      setCurrentQuestion(lastQuest)
      setFinished(false)
    }
    console.log(responses)
  }

  function previusQuestionFromContent() {
    if (!finished) {
      if (currentContent.previusContetId != null) {
        setCurrentContent(contents.filter(x => x.id == currentContent.previusContetId)[0])
        setToggleQuest(false)
      }
      else if (currentContent.previusQuestionId != null) {
        if(questions.filter(x => x.id == currentContent.previusQuestionId)[0].type == "multipeOption"){
          responses.filter(x => x.question != currentContent.previusQuestionId).map((item) => {
            console.log(item)
          })
        }else{
          console.log(responses.filter(x => x.question == currentContent.previusQuestionId))
          setSelectedOption(responses.filter(x => x.question == currentContent.previusQuestionId)[0].option)
        }
        setResponses(responses.filter(x => x.question != currentContent.previusQuestionId))
        setCurrentQuestion(questions.filter(x => x.id == currentContent.previusQuestionId)[0])
        setToggleQuest(true)
      }
    } else {
      setCurrentQuestion(questions.filter(x => x.nextQuestionId == null && x.nextContetId == null)[0])
      setToggleQuest(true)
      setFinished(false)
    }
    console.log(responses)
  }

  function levelFinished() {
    responses.map((item, index) => {
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

  function multipleOptionChange(id: string) {
    console.log(id)
    const opts: string[] = []
    for (const i in selectedOptions) {
      opts.push(selectedOptions[i])
    }
    opts.push(id)
    if (selectedOptions.filter(x => x == id).length != 0) {
      setSelectedOptions(selectedOptions.filter(x => x != id))
    } else {
      setSelectedOptions(opts)
    }
  }

  if (!finished) {
    return (
      <>
        <div
          className="min-h-screen flex items-center justify-start flex-col bg-gray-600"
          style={{
            background: "url(/src/assets/forest.jpg)",
            backgroundSize: "cover",
            backgroundPosition: 'center'
          }}
        >
          <Header />
          <div
            className="flex items-center justify-center mt-10 "
            style={{
              width: "100%",
            }}
          >
            {toggleQuest ? (
              <>
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
                      minWidth: '35%' 
                    }}
                  >
                    <div className="text-3xl font-semibold mb-6 text-white text-center">
                      {currentQuestion.title}
                    </div>
                    <div className="grid grid-cols-1 gap-4 w-11/12">
                      {options
                        .filter(
                          (x) => x.questionId == currentQuestion.id
                        )
                        .map((op) => {
                          if (currentQuestion.type === "multipeOption") {
                            return (
                              <div
                                onClick={() => {
                                  multipleOptionChange(op.id)
                                }}
                                className={`py-3 px-6 w-full rounded-lg border txt-lg text-white text-center cursor-pointer ${selectedOptions.filter((x) => x == op.id).length > 0
                                  ? "border-solid border-2 border-purple-600"
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
                                className={`py-3 px-6 w-full rounded-lg border cursor-pointer txt-lg text-white text-center ${selectedOption === op.id
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

                    <div className={`flex flex-row w-11/12 ${(currentQuestion.previusContetId != null || currentQuestion.previusQuestionId != null) ? "justify-between" : "justify-end"} `}>
                      {(currentQuestion.previusContetId != null || currentQuestion.previusQuestionId != null) && (
                        <button
                          onClick={() => {
                            previusQuestion();
                          }}
                          className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                        >
                          Voltar
                        </button>
                      )}

                      <button
                        onClick={() => {
                          nextQuestion();
                        }}
                        className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                      >
                        Proxima
                      </button>

                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  className="flex flex-col items-center p-4 bg-gray-700"
                  style={{
                    minHeight: "70vh",
                    maxWidth: "500px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    minWidth: '35%'
                  }}
                >
                  <div className="text-3xl font-semibold mb-6 text-white text-center">
                    {currentContent.title}
                  </div>


                  <div className="text-xl font-semibold mb-6 text-white text-center">
                    {currentContent.text}
                  </div>

                  <div className="flex flex-row justify-between" style={{ width: '90%' }}>
                    {(currentContent.previusContetId != null || currentContent.previusQuestionId != null) && (
                      <button
                        onClick={() => {
                          previusQuestionFromContent();
                        }}
                        className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                      >
                        Voltar
                      </button>
                    )}

                    <button
                      onClick={() => {
                        nextQuestionFromContent();
                      }}
                      className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                    >
                      Próxima
                    </button>

                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className="min-h-screen flex items-center justify-start flex-col bg-gray-600"
          style={{
            background: "url(/src/assets/forest.jpg)",
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
                  previusQuestion();
                }}
                className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
              >
                Pergunta anterior
              </button>

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
