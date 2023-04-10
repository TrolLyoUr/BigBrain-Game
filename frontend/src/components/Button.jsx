import React from 'react'
// import { styled } from "@mui/system"
import MUIButton from '@mui/material/Button'

function Button (props) {
  return (
    <MUIButton
      sx={{
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
      {...props}
      onClick={(e) => {
        console.log('...')
        props.onClick(e)
      }}
    >
      {props.children}
    </MUIButton>
  )
}

// const button = styled(MUIButton)({
//   paddingTop: "10px",
//   paddingBottom: "10px",
// })

export default Button
