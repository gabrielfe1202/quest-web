import { useEffect, useState } from 'react'
import '../App.css'
import { httpInstance } from '../services/httpRequest'
import { Link, useNavigate, useParams } from 'react-router-dom';

type LevelParams = {
    id: string;
};

function Level() {
    const { id } = useParams<LevelParams>();
    const [questions, setQuestions] = useState<any[]>([])
    const [options, setOptions] = useState<any[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [responses, setResponses] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        httpInstance.get(`/Questions/${id}`) // Altere o endpoint conforme necessário
            .then(response => {
                console.log(response.data);
                setQuestions(response.data.questions)
                setOptions(response.data.options)
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });

    }, []);


    function nextQuestion() {
        if (selectedOption != '') {
            const quest = questions[currentQuestion]
            responses.push({ question: quest.id, option: selectedOption, user: userId })
            console.log(responses)
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption('')
        } else {
            alert('escolha uma opção')
        }
    }

    function levelFinished() {
        responses.map((item: any, index) => {
            console.log(item)
            httpInstance.post(`/Responses`, item) // Altere o endpoint conforme necessário
                .then(response => {
                    console.log(response.data);
                    if (index + 1 === responses.length) {
                        navigate("/")
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                });
        })
    }
    if (currentQuestion + 1 <= questions.length) {
        return (
            <>
                {questions.length > 0 && (
                    <div className="flex flex-col items-center p-4 bg-gray-700" style={{ minHeight: '100vh' }}>
                        <div className="text-3xl font-semibold mb-6 text-white">{questions[currentQuestion].title}</div>
                        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                            {options.filter(x => x.questionId == questions[currentQuestion].id).map((op: any) => {
                                return (
                                    <div
                                        onClick={() => { setSelectedOption(op.id) }}
                                        className={`py-3 px-6 rounded-lg border txt-lg text-white text-center ${selectedOption === op.id ? "active" : ""}`}
                                    >
                                        {op.title}
                                    </div>
                                )
                            }
                            )}
                        </div>

                        <button onClick={() => { nextQuestion() }}>Proxima pergunta</button>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <div className="flex flex-col items-center p-4 bg-gray-700" style={{ minHeight: '100vh' }}>
                <div className="text-xl font-semibold mb-6">Fim</div>
                <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                    <p>pontos: {score}</p>
                    <button onClick={() => { levelFinished() }}>Finalizar</button>
                </div>
            </div>
        )
    }
}

export default Level
