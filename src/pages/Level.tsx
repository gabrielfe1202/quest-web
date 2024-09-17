import { useEffect, useState } from "react";
import "../App.css";
import { httpInstance } from "../services/httpRequest";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { ItemQuest, Question, type Content } from "../Models/Question";

type LevelParams = {
  id: string;
};

function Level() {
  const { id } = useParams<LevelParams>();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [questions, setQuestions] = useState<any[]>([]);
  const [questions2] = useState<Question[]>([]);
  const [item, setItem] = useState<ItemQuest>()
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [options, setOptions] = useState<any[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [contents, setContents] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();  
  const [currentContent, setCurrentContent] = useState<Content>();
  const [toggleQuest, setToggleQuest] = useState(true)
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [finished, setFinished] = useState(false)
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [responses, setResponses] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    httpInstance
      .get(`/Questions/${id}`)
      .then(async (response) => {
        console.log(response.data);
        setQuestions(response.data.questions);
        setOptions(response.data.options);
        setContents(response.data.contents)
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      })

  }, [id]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    questions.map((item) => {
      const teste = new Question(item.id)
      teste.title = item.title
      teste.type = item.type
      teste.nextQuestionId = item.nextQuestionId
      teste.nextContetId = item.nextContetId
      teste.previusQuestionId = item.previusQuestionId
      teste.previusContetId = item.previusContetId
      if (questions2.filter(x => x.id === item.id).length === 0) {
        questions2.push(teste)
      }
    })
    const itemq = new ItemQuest(questions2,contents)
    const first = itemq.getFirstItem()
    
    if(first !== null && first !== undefined){
      if(first.type === 'question'){
        setCurrentQuestion(first.quest)
      }
    }    

    setItem(itemq)

  }, [questions])

  function nextQuestionFromContent() {
    const next = currentContent?.getNextItem(questions2, contents)

    if (next !== undefined && next !== null) {
      if (next.type === 'question') {
        setCurrentQuestion(next.quest)
        if(next.quest.type === 'multipeOption'){
          responses.filter(x => x.question === next.quest.id).map((item) => {
            selectedOptions.push(item.option)
          })
        }else{
          console.log(responses.filter(x => x.question === next.quest.id))
          setSelectedOption(responses.filter(x => x.question === next.quest.id).length > 0 ? responses.filter(x => x.question === next.quest.id)[0].option : "")
        }
        setToggleQuest(true)
      } else if (next.type === 'content') {
        setCurrentContent(next.content)
        setToggleQuest(false)
      }
    } else {
      setFinished(true)
    }
  }

  function nextQuestion() {

    const next = currentQuestion?.getNextItem(questions2, contents)
    const resp = responses.filter(x => x.question !== currentQuestion?.id)

    if (currentQuestion?.type === "multipeOption") {
      if (selectedOptions.length > 0) {        
        selectedOptions.map((item) => {
          resp.push({
            question: currentQuestion?.id,
            option: item,
            user: userId,
          });
        })
        
      }
    } else {
      if (selectedOption !== "") {        
        resp.push({
          question: currentQuestion?.id,
          option: selectedOption,
          user: userId,
        });        
        
      } else {
        alert("escolha uma opção");
        return
      }
      setResponses(resp)
    }


    if (next !== undefined && next !== null) {
      if (next.type === 'question') {
        setCurrentQuestion(next.quest)
        if(next.quest.type === 'multipeOption'){
          responses.filter(x => x.question === next.quest.id).map((item) => {
            selectedOptions.push(item.option)
          })
        }else{
          setSelectedOption(responses.filter(x => x.question === next.quest.id).length > 0 ? responses.filter(x => x.question === next.quest.id)[0].option : "")
        }
        setToggleQuest(true)
      } else if (next.type === 'content') {
        setCurrentContent(next.content)
        setToggleQuest(false)        
      }
      setSelectedOptions([]);
      setSelectedOption("");
    } else {
      setFinished(true)
    }
  }


  function previusQuestion() {
    const prev = currentQuestion?.getPrevItem(questions2, contents)
    if (prev !== undefined && prev !== null) {
      if (prev.type === 'question') {
        setCurrentQuestion(prev.quest)
        if(prev.quest.type === 'multipeOption'){
          responses.filter(x => x.question === prev.quest.id).map((item) => {
            selectedOptions.push(item.option)
          })
        }else{
          setSelectedOption(responses.filter(x => x.question === prev.quest.id)[0].option)
        }
        setToggleQuest(true)
      } else if (prev.type === 'content') {
        setCurrentContent(prev.content)
        setToggleQuest(false)
      }
    }
  }

  function previusQuestionFromContent() {
    const prev = currentContent?.getPrevItem(questions2, contents)
    if (prev !== undefined && prev !== null) {
      if (prev.type === 'question') {
        setCurrentQuestion(prev.quest)
        if(prev.quest.type === 'multipeOption'){
          responses.filter(x => x.question === prev.quest.id).map((item) => {
            selectedOptions.push(item.option)
          })
        }else{
          setSelectedOption(responses.filter(x => x.question === prev.quest.id)[0].option)
        }
        setToggleQuest(true)
      } else if (prev.type === 'content') {
        setCurrentContent(prev.content)
        setToggleQuest(false)
      }
    }
  }

  function levelFinished() {
    responses.map((item, index) => {
      console.log('aaaa', responses)
      console.log(item);
      httpInstance
        .post('/Responses', item) // Altere o endpoint conforme necessário
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
    if (selectedOptions.filter(x => x === id).length !== 0) {
      setSelectedOptions(selectedOptions.filter(x => x !== id))
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
                {currentQuestion !== undefined && (
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
                          (x) => x.questionId === currentQuestion.id
                        )
                        .map((op) => {
                          if (currentQuestion.type === "multipeOption") {
                            return (
                              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                              <div
                                onClick={() => {
                                  multipleOptionChange(op.id)
                                }}
                                className={`py-3 px-6 w-full rounded-lg border txt-lg text-white text-center cursor-pointer ${selectedOptions.filter((x) => x === op.id).length > 0
                                  ? "border-solid border-2 border-purple-600"
                                  : ""
                                  }`}
                              >
                                {op.title}
                              </div>
                            )
                            // biome-ignore lint/style/noUselessElse: <explanation>
                          } else {
                            return (
                              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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

                    <div className={`flex flex-row w-11/12 ${(currentQuestion.previusContetId !== null || currentQuestion.previusQuestionId !== null) ? "justify-between" : "justify-end"} `}>
                      {(currentQuestion.previusContetId !== null || currentQuestion.previusQuestionId !== null) && (
                        // biome-ignore lint/a11y/useButtonType: <explanation>
                        <button
                          onClick={() => {
                            previusQuestion();
                          }}
                          className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                        >
                          Voltar
                        </button>
                      )}

                      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
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
                    {currentContent?.title}
                  </div>


                  <div className="text-xl font-semibold mb-6 text-white text-center">
                    {currentContent?.text}
                  </div>

                  <div className="flex flex-row justify-between" style={{ width: '90%' }}>
                    {(currentContent?.previusContetId !== null || currentContent?.previusQuestionId !== null) && (
                      // biome-ignore lint/a11y/useButtonType: <explanation>
                      <button
                        onClick={() => {
                          previusQuestionFromContent();
                        }}
                        className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
                      >
                        Voltar
                      </button>
                    )}

                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
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
    // biome-ignore lint/style/noUselessElse: <explanation>
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


              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => {
                  setFinished(false)
                }}
                className="py-2 px-4 bg-purple-700 rounded-md mt-2 float-right text-lg text-white"
              >
                Pergunta anterior
              </button>

              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
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
