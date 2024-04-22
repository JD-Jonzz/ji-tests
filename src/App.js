import BarsChart from "./BarsChart";
import LineChart from "./LineChart";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // flexDirection: "column",
        gap: "20px",
        padding: 30
      }}
    >
      <LineChart />
      <BarsChart />
    </div>
  );
}

export default App;
