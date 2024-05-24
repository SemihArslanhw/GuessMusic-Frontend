import { useRef, useState } from "react";

export default function Login({ setPlayer , socket }) {
    const dialogRef = useRef(null);
    const [isLoginOpen, setIsLoginOpen] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [playerInput, setPlayerInput] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        socket.current?.emit("join", { name: playerInput });
        setPlayer({ name: playerInput });
        setIsDialogOpen(false);
    }


    return ( isDialogOpen &&
        <dialog ref={dialogRef} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center h-full w-full">
            {/* Image */}
                <img src="backplan.png" className="h-1/2 rounded-l-lg"/>

            {/* Login/Register Form */}
            <div className="bg-white p-8 rounded-r-lg h-1/2 w-1/2 md:w-1/4 relative z-10">
                <button onClick={() => setIsDialogOpen(false)} className="absolute top-2 right-2 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {isLoginOpen && (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Login</h1>
                        <form className="flex flex-col gap-4">
                            <input type="text" placeholder="Username" className="p-2 border border-gray-300 rounded-md" onChange={(e)=>{setPlayerInput(e.target.value)}} />
                            <input type="password" placeholder="Password" className="p-2 border border-gray-300 rounded-md" />
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md" onClick={handleLogin}>Login</button>
                            <span onClick={() => setIsLoginOpen(false)} className="text-blue-500 cursor-pointer">Don't you have an account?</span>
                        </form>
                    </>
                )}
            </div>
        </dialog>
    );
}