import React from "react";
import { Typography, Paper } from "@mui/material";
import FileNotFound from "@assets/images/FileNotFound";

const NoResults = () => (
  <Paper sx={{
    padding: '1rem 2rem', 
    display: 'flex', 
    gap: 2, 
    alignItems: 'center',
    backgroundColor: '#00132c57',
    borderRadius: '1rem',
    color: '#6b9dde'
  }}>
    <FileNotFound color="orange" size={35} />
    <Typography variant="body1" >No results found</Typography>
  </Paper>
);

export default NoResults;