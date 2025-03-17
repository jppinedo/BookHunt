import React from "react";
import { CircularProgress, Paper } from "@mui/material";

const LoadingResults = ({ sx }) => (
<Paper sx={{ 
    p: 1.5, 
    borderRadius: 2, 
    marginLeft: 'auto', 
    marginRight: 'auto', 
    maxWidth: 'fit-content', 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    flex: '0 0 100%',
    ...sx }}
  >
    <CircularProgress color="primary" size={30} />
  </Paper>
);

export default LoadingResults;
