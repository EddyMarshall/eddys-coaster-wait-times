import './App.css'
import React, { useEffect, useState } from 'react';
import { Spin, Card } from "antd";

function App() {
  const [coasters, setCoasters] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const rawRes = await fetchCoasters();
        const jsonRes = await rawRes.json();

        const formattedCoasters = jsonRes && jsonRes.lands && jsonRes.lands.map(land => {
          return land.rides
        }).flat()

        setCoasters(formattedCoasters)
      } catch (err) {
        console.log(err);
      }
    })()
  }, []);

  if (!coasters) return <Spin fullscreen={true}/>

  return (
    <div className='appBody'>
      {coasters.map((coaster, i) => {
        return (
          <div key={i} className='card'>
            <CoasterCard content={coaster} />
          </div>
        )
      })}
    </div>
  );
}

function CoasterCard({content}) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <Card.Grid className='unexpandedCard' onClick={() => setExpanded(!expanded)}>{content.name}</Card.Grid>
    )
  }

  return (
    <Card type='inner' title={content.name} onClick={() => setExpanded(!expanded)}>
      {`Wait Time: ${content.wait_time} minutes`}
    </Card>
  )
}

async function fetchCoasters() {
  return await fetch(
    "https://hidden-ravine-39907-0113fb68692a.herokuapp.com/https://queue-times.com/parks/15/queue_times.json",
    { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  )
}

export default App;
