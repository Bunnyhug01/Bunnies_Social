import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Chip, TextField, Box } from '@mui/material';

interface Props {
    tags: string[],
    setTags: React.Dispatch<React.SetStateAction<string[]>>,
    langDictionary: any
}

const TagsInput = ({ langDictionary, tags, setTags }: Props) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      addTag(inputValue.trim());
      setInputValue('');
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box>
      <TextField
        label={langDictionary['add_tags']}
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        fullWidth
        margin="normal"
      />
      <Box mt={2}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDeleteTag(tag)}
            style={{ marginRight: 8, marginBottom: 8 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagsInput;