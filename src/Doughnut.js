import React from 'react'
import { Chart } from 'recharts'
import { Doughnut,plugins,legend } from 'recharts'
import { Typography } from '@mui/material'






 const labels=[100000]
 const data={
  labels,
  datasets:
    {
    labels,
    dataset:[200,400],
    display:true
    
    
    
  },
  responsive:true

}
const options={
plugins:{
  legend:{
    position:'right'
  },
  title:{
    display:true,
   
  }
},
 
  }

  
const Doughnutchart = () => {
    
   
  return (
    
    <div style={{ 
      
      width: '90%',
        height:'250px',
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.06)',  
    }}
    
    >
    

      <Typography variant='h6' id='material' >Monthly Income</Typography>
      
    
    </div>
  )
}

export default Doughnutchart
