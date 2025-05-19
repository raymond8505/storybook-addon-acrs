import React, { useEffect, useState } from "react"
export function ReportViewer({id}: {id?: string})
{
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/${id}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          response.json().then((json) => {
            console.log("Report", json);
          })
        })
      }
  },[id])
  return <div>
    {id}
  </div>
}