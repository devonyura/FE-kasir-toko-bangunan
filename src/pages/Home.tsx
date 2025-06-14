// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Button } from "@/components/ui/button";
// import './App.css'

function Home() {
  // const [count, setCount] = useState(0)

  return (
      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1>Ini Home</h1>
        <Button>Click Me</Button>
        <div className="p-4">
      <h1 className="text-xl font-bold">Kasir Toko Bangunan</h1>
      {/* <Outlet /> */}
    </div>
      </div>
      
  )
}

export default Home
