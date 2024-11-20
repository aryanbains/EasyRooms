import React from "react";
import './pdfpage.css';

const PDFViewer = () => {
  return (
    <div className="pdf-container">
      <iframe
        src="./newone.pdf"
        title="PDF Viewer"
        className="pdf-viewer"
      ></iframe>
    </div>
  );
};

export default PDFViewer;
