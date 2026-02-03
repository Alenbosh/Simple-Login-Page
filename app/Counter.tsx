'use client'

import { useState } from 'react'

function action(){
  console.log("HI")
}

export default function Counter({acton}:any){
  const [count,setCount] = useState(0)

  return(
    <button onClick={action} className="bg-sky-500">
    Count:{count}
    </button>
  )
}
