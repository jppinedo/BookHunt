import React from "react";
import { Paper, Typography } from "@mui/material";


const InfoBox = ({ icon: IconElement, content }) => {
    
  return (
    <Paper sx={{ 
      display: 'flex', 
      p: 1, mb: 1, mt: 1, 
      backgroundColor: '#cee3ff',
      border: '1px solid #7bb4ff',
      color: '#00357b',
      minWidth: '300px',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box',
      borderRadius: '0.5rem',
      alignItems: 'center'
    }}>
      <IconElement sx={{mr: 1}} />
      <Typography variant="body2">{content}</Typography>
    </Paper>
  )
}

export default InfoBox;