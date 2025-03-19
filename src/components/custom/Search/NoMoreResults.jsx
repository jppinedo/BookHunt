import React from "react";
import { Typography, Paper } from "@mui/material";

const NoMoreResults = () => (
  <div style={{width:'100%', display: 'flex', justifyContent: 'center'}} >
    <Paper sx={{ 
      margin: '0 auto' , 
      maxWidth: 'fit-content',
      backgroundColor: '#00132c57',
      borderRadius: '1rem',
      color: '#6b9dde'
    }}>
      <Typography variant="body2" sx={{ padding: '1rem 4rem' }}>No more results found.</Typography>
    </Paper>
  </div>
);

export default NoMoreResults;