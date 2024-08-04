import React, { useState } from "react";

export default function List() {
    const [children, setChildren] = useState<string[]>([]);
    return (
        <>
            <button onClick={()=>{
                setChildren([...children, "child"])
            }}>
                Add
            </button>
            <ol>
                {
                    children.map((c,i) =>
                        <li key={i}>{c}</li>
                    )
                }
            </ol>
        </>
    )
}