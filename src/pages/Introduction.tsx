import Header from "../components/Header";

export function Introduction() {
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
                    className="flex flex-col mt-12 items-center w-11/12 p-4 bg-gray-700 mb-12 lg:w-8/12"
                    style={{
                        minHeight: "70vh",
                    }}
                >

                    <iframe width="70%" height="400" src="https://www.youtube.com/embed/P39f0_aYv-Y" title="14-ELIS_REGINA - REDESCOBRIR [HD 640x360 XVID Wide Screen].avi" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                    <p className="text-white text-left font-bold w-full text-3xl mt-10 px-12">Lorem ipsum dolor</p>
                    <p className="text-white text-xl mt-4 px-12 w-full">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolorem dolores, nam iste molestiae deleniti sunt. Adipisci eaque rerum non itaque! Itaque architecto iusto, quaerat et quidem praesentium a maiores!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolorem dolores, nam iste molestiae deleniti sunt. Adipisci eaque rerum non itaque! Itaque architecto iusto, quaerat et quidem praesentium a maiores!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolorem dolores, nam iste molestiae deleniti sunt. Adipisci eaque rerum non itaque! Itaque architecto iusto, quaerat et quidem praesentium a maiores!
                    </p>

                    <div className="w-full px-12">
                        <button className="bg-purple-600 px-12 py-3 rounded-lg text-white text-xl font-bold float-end">
                            Começar
                        </button>
                    </div>

                </div>

            </div>
        </>
    )
}