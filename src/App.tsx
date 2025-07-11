// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// App.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "@/utils/navigate";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate); // pasang navigate ke global
  }, [navigate]);

  return (
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1>Ini Halaman Login</h1>
      <Button>Click Me</Button>
    </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  );
}

export default App;
