import { Dispatch, MutableRefObject, SetStateAction, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Box, Button, Grid, IconButton, Input, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import uploadFile from '../../firebase/uploadFile';
import deleteFile from '../../firebase/deleteFile';
import { UploadTask } from 'firebase/storage';


interface Props {
  setFile: (file : File | null) => void,
  fileType: string,
  reference?: {
    fileRef: string,
    setFileRef: Dispatch<SetStateAction<string>>
  },
  setProgress?: Dispatch<SetStateAction<number>>,
  cancel: {
    uploadRef: MutableRefObject<UploadTask | undefined>,
    setUploadingCancellation: Dispatch<SetStateAction<boolean>>,
    setIsFileUpload: Dispatch<SetStateAction<boolean>>
  },
  langDictionary: any
}


export default function UploadZone({ setFile, fileType, reference, setProgress, cancel, langDictionary }: Props) {

  const accept = fileType === 'video' ? ['video/mp4'] : ['image/png' , 'image/jpeg']

 
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader;

    file.onload = function() {
      setPreview(file.result);
    }

    file.readAsDataURL(acceptedFiles[0])
    setFile(acceptedFiles[0])

    cancel.setUploadingCancellation(false)

    if (reference !== undefined) {

      if (reference.fileRef !== "") {
        deleteFile(reference.fileRef)
      }

      const fileObj = {
        file: acceptedFiles[0],
        setFileRef: reference.setFileRef,
        directory: fileType + 's',
        setProgress: setProgress,
        uploadRef: cancel.uploadRef
      }
      
      uploadFile(fileObj)

    }

  }, [])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
  });

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  function handleCancel() {
    cancel.setUploadingCancellation(true)
    cancel.setIsFileUpload(false)

    setPreview(null)

    cancel.uploadRef.current?.cancel()

    if (reference !== undefined)  {
      if (reference.fileRef !== "") {
        deleteFile(reference.fileRef)
        reference.setFileRef("")
      }
    }

  }

  return (
    <Box>
      <Grid 
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: 200, display: 'flex' }}
        className='border-4 border-dashed'
      >
        <CloudUploadIcon fontSize='large' />
        <Box {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
            <Typography>{langDictionary['drop_files']}</Typography> :
            <Typography>{langDictionary['drag_or_click_files']}</Typography>
          }
        </Box>
      </Grid>

      {preview && (
        <Box sx={{width: 'auto', height: 350, marginTop: 2}}>
          <div className='relative'>
            {fileType === 'video'
              ?  <video src={preview as string} autoPlay loop controls muted className="w-full h-full" /> 
              :  <img src={preview as string} alt="" className="w-full h-full max-h-[350px]" />
            }
            <IconButton
              className='absolute top-0 right-0 bg-red-700 text-white p-2 rounded hover:bg-red-800 m-2'
              onClick={() => {
                handleCancel()
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </Box>
      )}
    </Box>

  )
}