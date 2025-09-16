"use client"

import Body from "@/components/ui/body"
import Header from "@/components/ui/header"
import { use } from "react"


const C = ({ params }: { params: Promise<{ uid: string }> }) => {
  const { uid } = use(params);

  return (
    <>
      <Header token={uid}/>
      <Body token={uid} />
    </>
  )
}

export default C;
