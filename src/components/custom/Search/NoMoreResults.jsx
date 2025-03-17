import React from "react";
import { Typography, Paper } from "@mui/material";

const NoMoreResults = () => (
  <Paper sx={{ margin: '0 auto' , maxWidth: 'fit-content'}}>
    <Typography sx={{ padding: '1rem 4rem' }}>No more results found.</Typography>
  </Paper>
);

export default NoMoreResults;