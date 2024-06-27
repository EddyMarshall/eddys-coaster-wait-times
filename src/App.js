import './App.css'
import React, { useEffect, useState } from 'react';
import { Spin, Card, Input } from "antd";

function App() {
  const [coasters, setCoasters] = useState(null)
  const [searchParams, setSearchParams] = useState('')

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
      <h1 className='header'>Eddy's Coaster Wait Times!</h1>
      <Input className='searchBar' onChange={e => setSearchParams(e.target.value)} size="large" placeholder="Search!" />
      {coasters.filter(coaster => coaster.name.toLowerCase().includes(searchParams)).map((coaster, i) => {
        return (
          <div key={i}>
            <CoasterCard className='cardContainer' content={coaster} />
          </div>
        )
      })}
    </div>
  );
}

function CoasterCard({content}) {
  const [expanded, setExpanded] = useState(false);
  const title = <div className='title'>{content.name}</div>

  if (!expanded) {
    return (
      <Card className='card' onClick={() => setExpanded(!expanded)}>
        {title}
      </Card>
    )
  }

  return (
    <Card className='card' type='inner' title={title} onClick={() => setExpanded(!expanded)}>
      <div className='cardContent'>
        {`Wait Time: ${content.wait_time} minutes`}
      </div>
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
