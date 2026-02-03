// 'use client'
import Counter from './Counter'
import ClientWidget from './ClientWidget'


// async function getData(){
//   return {
//     time:new Date().toISOString()
//   }
// }





function sayHello(){
  console.log("HI")
}

export default async function Page(){
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json())
  // console.log("Page Renders") Server side Rendering v/s client-side rendering

  return(
    <div>
      <h1>
        server component
      </h1>
      <ClientWidget data={data} />
      <p>Server time: {data.time}</p>
      <Counter action={sayHello} />
    </div>
  )
}
