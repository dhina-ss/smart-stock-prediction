import { useState } from 'react';
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import StockChart from './components/StockChart';


function App() {
	const [predictionData, setPredictionData] = useState({});
	const [historicalData, setHistoricalData] = useState([]);

	const handlePredict = (data) => {
		setPredictionData(data);
		setHistoricalData(data.historical_data || []);
	};

	return (
		<>
			{/* <Header /> */}
			<SearchBar onPredict={handlePredict} />
			<Dashboard predictionData={predictionData} />
			<StockChart historicalData={historicalData} predictions={predictionData.predictions} />
		</>
	)
}

export default App
