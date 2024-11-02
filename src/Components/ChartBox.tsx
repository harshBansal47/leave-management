import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartContainer: React.FC<{ title: string; data: any; }> = ({ title, data }) => (
    <div className="bg-white p-6 w-full md:w-1/2 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-md font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="w-full h-64">
            <Line
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time Period',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Requests',
                            },
                        },
                    },
                }}
            />
        </div>
    </div>
);

export default ChartContainer;