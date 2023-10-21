import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Index } from "./pages/Index";
import { Balance } from './pages/Balance';
import { Tx } from "./pages/Tx";
import { Activity } from "./pages/Activity";
import { BatchCheck } from './pages/BatchCheck';
import { Volume } from './pages/Volume';
import { InternalVolume } from './pages/InternalVolume';
import './i18n';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/tx" element={<Tx />} />
        <Route path="/volume" element={<Volume />} />
        <Route path="/internalvolume" element={<InternalVolume />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/batchcheck" element={<BatchCheck />} />
      </Route>
    </Routes>
  );
}

export default App;
