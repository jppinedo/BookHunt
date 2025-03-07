import React, {useState} from "react";
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase, IconButton, Box} from '@mui/material';


const SearchInput = ({
    onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
  <Box sx={{textAlign:'center'}}>
    <Paper
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', minWidth: 300, maxWidth: 600, width: '100%', marginLeft:'auto', marginRight: 'auto'}}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by title or ISBN"
        inputProps={{ 'aria-label': 'Find by title or ISBN' }}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => onSearch(query)}>
        <SearchIcon />
      </IconButton>
    </Paper>
    </Box>
  )
}

export default SearchInput;