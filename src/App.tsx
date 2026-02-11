import GlobalLayout from "@/components/GlobalLayout";
import Activity from "@/routes/Activity";
import AlbumDetail from "@/routes/AlbumDetail";
import Albums from "@/routes/Albums";
import Error from "@/routes/Error";
import Gallery from "@/routes/Gallery";
import Home from "@/routes/Home";
import SignupComplete from "@/routes/SignupComplete";
import SongDetail from "@/routes/SongDetail";
import ToArtist from "@/routes/ToArtist";
import "@/styles/globals.css";
import type { FC } from "react";
import { Route, Routes } from "react-router";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/signup-complete" element={<SignupComplete />} />

      <Route element={<GlobalLayout />} errorElement={<Error />}>
        <Route path="/" element={<Home />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/album/:albumId" element={<AlbumDetail />} />
        <Route path="/album/:albumId/song/:songId" element={<SongDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/toArtist" element={<ToArtist />} />
      </Route>
    </Routes>
  );
};

export default App;
