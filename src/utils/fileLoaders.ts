export type FileLoaderComplete = (fileReader?: FileReader) => void;

export interface FileLoaderFuncProps {
  documentURI: string;
  signal: AbortSignal;
  fileLoaderComplete: FileLoaderComplete;
}

export type FileLoaderFunction = (props: FileLoaderFuncProps) => void;
type ReaderTypeFunction = "dataURL" | "arrayBuffer" | "binaryString" | "text";
interface BaseFileLoaderFuncOptions extends FileLoaderFuncProps {
  readerTypeFunction: ReaderTypeFunction;
}

type BaseFileLoaderFunction = (props: BaseFileLoaderFuncOptions) => void;

const _fileLoader: BaseFileLoaderFunction = ({
  documentURI,
  signal,
  fileLoaderComplete,
  readerTypeFunction,
}) =>
  fetch(documentURI, { signal })
    .then(async (res) => {
      const blob = await res.blob();

      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", () =>
        fileLoaderComplete(fileReader)
      );

      switch (readerTypeFunction) {
        case "arrayBuffer":
          fileReader.readAsArrayBuffer(blob);
          break;
        case "binaryString":
          fileReader.readAsBinaryString(blob);
          break;
        case "dataURL":
          fileReader.readAsDataURL(blob);
          break;
        case "text":
          fileReader.readAsText(blob);
          break;

        default:
          break;
      }
    })
    .catch((e) => e);

export const arrayBufferFileLoader: FileLoaderFunction = (props) =>
  _fileLoader({ ...props, readerTypeFunction: "arrayBuffer" });

export const dataURLFileLoader: FileLoaderFunction = (props) =>
  _fileLoader({ ...props, readerTypeFunction: "dataURL" });

export const textFileLoader: FileLoaderFunction = (props) =>
  _fileLoader({ ...props, readerTypeFunction: "text" });

export const binaryStringFileLoader: FileLoaderFunction = (props) =>
  _fileLoader({ ...props, readerTypeFunction: "binaryString" });

export const defaultFileLoader = dataURLFileLoader;
