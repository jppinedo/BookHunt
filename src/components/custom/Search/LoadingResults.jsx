import React from "react";
import { CircularProgress, Paper } from "@mui/material";

const LoadingResults = ({ sx }) => (
  <div style={{width:'100%', display: 'flex', justifyContent: 'center'}} >
    <Paper sx={{ 
        p: 1.5, 
        borderRadius: 2, 
        maxWidth: 'fit-content', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        ...sx }}
      >
        <CircularProgress color="primary" size={30} />
    </Paper>
  </div>
);

export default LoadingResults;
