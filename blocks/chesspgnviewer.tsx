import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { pgnEdit, pgnView } from "@mliebelt/pgn-viewer";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Layout } from "@mliebelt/pgn-viewer/lib/types";

export default function ExampleFileBlock(props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      console.log(windowSize);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  let currentBase=useRef<any>();
  useLayoutEffect(() => {
    // Only way to make responsiveness (on resizing resets the board but haven't found a better way)
    let boardSize = `${windowSize.height - 400}px`;
    let layout: Layout = "left";
    let width = `${windowSize.width*2/3}px`;
    if (windowSize.width < 600) {
      boardSize = `${windowSize.width - 40}px`;
      width = boardSize;
      layout = "top";
    }
    let { base, board } = pgnEdit("board", {
      pgn: currentBase.current?currentBase.current.getPgn().writePgn():content,
      pieceStyle: "wikipedia",
      theme: "brown",
      showResult: true,
      boardSize: boardSize,
      width: width,
      layout: layout,
      figurine: "merida",
      manyGames: true,
      showFen: false
    });
    currentBase.current=base;
  }, [windowSize]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id="board" style={{ margin: "auto" }} />
    </div>
  );
}
