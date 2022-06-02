import { useDropzone } from "react-dropzone";
import { Box, IconButton, styled } from "@mui/material";
import { Clear, UploadFile } from "@mui/icons-material";
import { useEffect, useState } from "react";

type Props = {
  onChange: (base64: string) => void;
  width?: number;
  height?: number;
};

const DropzoneWrapper = styled(Box)(({ theme }) => ({
  borderWidth: "2px",
  borderStyle: "dashed",
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const DropzoneInner = styled(Box)<{ file: string }>(({ file, theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  overflow: "hidden",
  ...(file
    ? {
        backgroundImage: `url(${file})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        justifyContent: "flex-end",
        alignItems: "flex-start",
      }
    : {
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          background: theme.palette.primary.main + "1A", // opacity: 0.1
        },
      }),
}));

export const Dropzone = (props: Props): JSX.Element => {
  const { onChange, width = 450, height = 250 } = props;

  const [file, setFile] = useState<string>("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onloadend = () => setFile(String(reader.result) || "");
    },
  });

  useEffect(() => {
    onChange(file);
  }, [file]);

  return (
    <DropzoneWrapper {...getRootProps()} width={width} height={height}>
      <DropzoneInner width={width - 20} height={height - 20} file={file}>
        {file ? (
          <IconButton onClick={() => setFile("")} color={"primary"}>
            <Clear />
          </IconButton>
        ) : (
          <UploadFile sx={{ fontSize: 60 }} color={"primary"} />
        )}
      </DropzoneInner>
      <input {...getInputProps()} />
    </DropzoneWrapper>
  );
};
