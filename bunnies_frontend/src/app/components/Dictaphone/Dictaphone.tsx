import 'regenerator-runtime/runtime'
import { Box, IconButton } from '@mui/material';
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import MicIcon from '@mui/icons-material/Mic';

import { useEffect, useState } from "react";

interface Props {
    setDictaphoneInput?: React.Dispatch<React.SetStateAction<string | undefined>>,
    lang: string
}


export default function Dictaphone({ setDictaphoneInput, lang }: Props) {
  const [isStart, setIsStart] = useState<boolean>(false);
  

  const {
    transcript,
    resetTranscript,
  } = useSpeechRecognition({
    commands: [
      {
        command: "reset",
        callback: () => resetTranscript()
      },
    ]
  });

  useEffect(() => {
    if (transcript !== "" && setDictaphoneInput !== undefined) {

      const text = transcript.replace('.', '')
      setDictaphoneInput(text)
    }
    
  }, [transcript]);


  function listenContinuously() {
    SpeechRecognition.startListening({
      continuous: true,
      language: lang
    });
  };


  const handleClick = () => {
    setIsStart(!isStart)
  }

  useEffect(() => {
    if (isStart) {
        listenContinuously()
    }
    else {
        SpeechRecognition.stopListening()
        resetTranscript()
    }
  }, [isStart])

  return (
    <Box>
        <IconButton
            color="inherit"
            type="button"
            onClick={handleClick}
        >
            <MicIcon />
        </IconButton>
    </Box>
  );
}