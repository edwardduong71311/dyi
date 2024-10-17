"use client";

import MainApp from "./components/MainApp";
import ThreeContextProvider from "./context/ThreeContext";

export default function Home() {
  return (
    <>
      <ThreeContextProvider>
        <MainApp />
      </ThreeContextProvider>
    </>
  );
}
