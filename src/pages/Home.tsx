import { useEffect, useState } from 'react'
import '../App.css'
import { httpInstance } from '../services/httpRequest'
import { Link, useNavigate } from 'react-router-dom';

class level {
    public completed: boolean;
    constructor(public title: string, public order: number, public id: string) {
        this.completed = false
    }
}

function Home() {
    const [levels, setLevels] = useState<level[]>([])
    const [completions, setCompletions] = useState<any[]>([])
    const [score, setScore] = useState<number>(0)
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {

        httpInstance.get(`/Level/${userId}`) // Altere o endpoint conforme necessário
            .then(response => {
                console.log(response.data);
                setLevels(response.data.Levels)
                setCompletions(response.data.Completions)
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });

        httpInstance.get(`/UserInfo/${userId}`) // Altere o endpoint conforme necessário
            .then(response => {
                console.log(response.data);
                setScore(response.data.score)
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-start flex-col bg-gray-600">
                <div className="w-full bg-gray-800 text-white py-4 px-8 flex justify-between items-center">
                    <div className="text-lg font-semibold">Jogo de Níveis</div>
                    <div className="text-lg">
                        Pontos do Jogador: <span className="font-bold">{score}</span>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-10 ">
                    <div className="flex flex-col items-center space-y-8 mt-10">
                        {levels.map((item, index) => {
                            console.log('item: ', item)
                            return (
                                <>
                                    <div className='p-10 bg-purple-300 rounded-md'>
                                        <div>
                                            <h2 style={{ color: '#000' }}>{item.title}</h2>

                                            <p>{item.completed}</p>
                                            {completions
                                                .filter(x => x.levelId === item.id).length > 0 ? (
                                                <>
                                                    <p>Completo</p>
                                                </>
                                            ) : (

                                                <>
                                                    {
                                                        index > 0 ? (
                                                            completions
                                                                .filter(x => x.levelId === levels[index - 1]?.id).length > 0 ? (
                                                                <>
                                                                    <button onClick={() => navigate(`/level/${item.id}`)}>Jogar</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p>Bloqueado</p>
                                                                </>
                                                            )
                                                        ) : (
                                                            <>
                                                                <Link to={`/level/${item.id}`}>jogar</Link>
                                                            </>
                                                        )
                                                    }
                                                </>

                                            )
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>

            </div>

        </>
    )
}

export default Home
