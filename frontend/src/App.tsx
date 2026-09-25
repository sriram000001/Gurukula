import { useState } from "react";
import Diagnostic from "./pages/Diagnostic";
import PathView from "./pages/PathView";

export default function App() {
  const [done, setDone] = useState(false);
  return done ? <PathView /> : <Diagnostic onDone={() => setDone(true)} />;
}
