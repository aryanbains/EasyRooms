import React, { useState } from 'react';
import { storage } from '../firebaseConfig'; // Make sure this path is correct
import { ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const FileUpload = ({ roomId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const fileRef = ref(storage, `rooms/${roomId}/files/${uuidv4()}_${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload File</button>
    </form>
  );
};

export default FileUpload;
