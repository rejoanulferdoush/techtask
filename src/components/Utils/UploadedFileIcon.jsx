import imgIcon from "./../../../public/photo-gallery.png";
import docIcon from "./../../../public/docx-file.png";
import pdfIcon from "./../../../public/pdf.png";
import pptIcon from "./../../../public/ppt.png";
import txtIcon from "./../../../public/txt.png";
import xlsIcon from "./../../../public/xls.png";
import { useEffect, useState } from "react";

const UploadedFileIcon = ({ fileName, width = "36px", height = "36px" }) => {
  const [icon, setIcon] = useState(null);
  const getFileExtension = (file) => {
    return file.split(".").pop().toLowerCase();
  };
  const fileExtension = getFileExtension(fileName);
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "..."; // Truncate and add ellipsis
    }
    return str; // If the string is already within the limit, return as is
  };
  useEffect(() => {
    switch (fileExtension) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        setIcon(imgIcon);
        break;
      case "docx":
      case "doc":
        setIcon(docIcon);
        break;
      case "pdf":
        setIcon(pdfIcon);
        break;
      case "pptx":
      case "ppt":
        setIcon(pptIcon);
        break;
      case "txt":
        setIcon(txtIcon);
        break;
      case "xlsx":
      case "xls":
      case "csv":
        setIcon(xlsIcon);
        break;
      default:
        break;
    }
  }, [fileExtension]);

  return (
    <div className="flex space-x-2 pe-4 items-center">
      <img
        src={icon}
        className={`rounded-md inline-block object-cover`}
        style={{ width: width, height: height }}
      />
      <span className="text-lg">{truncateString(fileName, 15)}</span>
    </div>
  );
};

export default UploadedFileIcon;
