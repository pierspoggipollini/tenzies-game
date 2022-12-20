import React from 'react'

const Die = ({value, isHeld, holdDice}) => {
  const style = {
    backgroundColor: isHeld === true ? '#59E391' : 'white'
  }
  return (
    <div style={style} onClick={holdDice} className='die-face'>
        <h2>{value}</h2>
       </div>
  )
}

export default Die