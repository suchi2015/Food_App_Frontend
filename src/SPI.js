import React from 'react'
import {Typography,Button} from '@mui/material'
import Doughnutchart from './Doughnut'
import './SPI.css'

 const SPI=()=>{
    return (
        <>
        <div classname='main'>
            <div className='left'>
               
                <Button  variant='contained' id='sip'  > SIP</Button>
                 <Button  variant='contained' id='sip'  > Lumpsum</Button>
             
            
            </div>
            <div className= 'body' >
                 <Typography id='heading'> Monthly Interest</Typography>
                <Button  variant='contained' > SIP</Button>
            </div>
            <div className='right'>
               
            </div>
        </div>
        </>
    )
 }
 export default SPI