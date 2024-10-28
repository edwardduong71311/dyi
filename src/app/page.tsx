"use client";

import MainApp from "./pages/MainApp";
import ThreeContextProvider from "./context/ThreeContext";

export default function Home() {
  return (
    <>
      <ThreeContextProvider rootId="threejs">
        <MainApp />
      </ThreeContextProvider>
    </>
  );
}
