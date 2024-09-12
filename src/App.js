import './App.css'
import React, { useState } from 'react';
import { Spin, Card, Input } from "antd";

const allParks = [
  { name: 'Animal Kingdom', id: '8' },
  { name: 'Disney Hollywood Studios', id: '7' },
  { name: 'Disney Magic Kingdom', id: '6' },
  { name: 'Disneyland', id: '16' },
  { name: 'Epcot', id: '5' },
  { name: 'Islands Of Adventure At Universal Orlando', id: '64' },
  { name: 'Universal Studios At Universal Orlando', id: '65' },
]

function App() {
  const [currentView, setCurrentView] = useState('all-parks-index-view');
  const [currentPark, setCurrentPark] = useState(null);
  const [coasters, setCoasters] = useState(null)

  async function handleSelectPark(park) {
    setCurrentView('park-view');
    setCurrentPark(park);

    try {
      const rawRes = await fetchCoasters(park.id);
      const jsonRes = await rawRes.json();

      const formattedCoasters = jsonRes && jsonRes.lands && jsonRes.lands.map(land => {
        return land.rides
      }).flat().sort(function (a, b) {
        if (a.name > b.name) return 1;
        if (b.name > a.name) return -1;
        return 0;
      })

      setCoasters(formattedCoasters)
    } catch (err) {
      console.log(err);
    }
  }

  function handleBackClick() {
    setCurrentView('all-parks-index-view')
    setCurrentPark(null);
    setCoasters(null)
  }

  return (
    <div className='appBody'>
      {currentView === 'all-parks-index-view' && <h1 className='header' >Eddy's Ride Wait Times!</h1>}
      {currentView === 'all-parks-index-view' && <AllParksView onSelect={handleSelectPark} />}
      {currentView === 'park-view' && <ParkView coasters={coasters} park={currentPark} onBackClick={handleBackClick}/>}
    </div>
  );
}

function AllParksView({ onSelect }) {
  return (
    <div>
      {allParks.map((park, index) => {
        return (
          <Card key={`${park.id}-${index}`} className='card' type='inner' title={park.name} onClick={() => onSelect(park)}/>
        )
      })}
    </div>
  )
}


function ParkView({ park, coasters, onBackClick }) {
  const [searchParams, setSearchParams] = useState('')

  if (!coasters) return <Spin fullscreen={true}/>

  return (
    <div>
      <h2 className='header'>
        <div onClick={onBackClick} className='back-button'>back</div>
        {park.name}
      </h2>
      <Input className='searchBar' onChange={e => setSearchParams(e.target.value.toLowerCase())} size="large" placeholder="Search!" />
      {coasters.filter(coaster => coaster.name.toLowerCase().includes(searchParams)).map((coaster, i) => {
        return (
          <div key={i}>
            <CoasterCard className='cardContainer' content={coaster} />
          </div>
        )
      })}
    </div>
  )
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
        <div>
          {`Status: ${content.is_open === true ? 'open!' : 'closed :('} `}
        </div>
        <div>
          {content.is_open === true && `Wait Time: ${content.wait_time} minutes`}
        </div>
      </div>
    </Card>
  )
}



async function fetchCoasters(id) {
  return await fetch(
    `https://nameless-gorge-76050-68e1f4153119.herokuapp.com/https://queue-times.com/parks/${id}/queue_times.json`,
    { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  )
}

export default App;
