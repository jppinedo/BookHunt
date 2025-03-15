import React from "react";
import { Typography, Paper } from "@mui/material";
import FileNotFound from "@assets/images/FileNotFound";

const NoResults = () => (
  <Paper sx={{p:5, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 3}}>
    <FileNotFound color="orange" size={55} />
    <Typography variant="h6" >No results found</Typography>
  </Paper>
);

export default NoResults;