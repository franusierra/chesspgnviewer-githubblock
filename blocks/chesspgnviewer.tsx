import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { pgnEdit, pgnView } from "@mliebelt/pgn-viewer";
import { writeGame } from './pgn-writer/pgn-writer';
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@primer/react"; 
import { Layout } from "@mliebelt/pgn-viewer/lib/types";

export default function ExampleFileBlock(props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata,onUpdateContent } = props;
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

  function getFullCurrentPgn(){
    let pgnReader : any= currentBase.current.getPgn();
    let editedCurrentPgnContent="";
    for(let i=0;i<pgnReader.getGames().length;i++){
      let game=pgnReader.getGame(i);
      editedCurrentPgnContent+=writeGame(game, pgnReader.configuration)+"\n\n";
    }
    return editedCurrentPgnContent;
  }

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
      pgn: currentBase.current?getFullCurrentPgn():content,
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
    console.log(board);
    console.log(base);
    
    currentBase.current=base;
  }, [windowSize]);
  function saveCurrentGame(){
    let editedCurrentPgnContent=getFullCurrentPgn();
    onUpdateContent(editedCurrentPgnContent);
  }
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
      <Button style={{position:'absolute',top:'8px',left:'8px'}} onClick={saveCurrentGame}>Save current game</Button>
    </div>
  );
}
