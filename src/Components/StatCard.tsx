const StatCard: React.FC<{ label: string; value: number; bgClass: string; }> = ({ label, value, bgClass }) => (
    <div className={`text-white p-4 rounded-lg shadow ${bgClass}`}>
        <h3 className="text-md font-medium">{label}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);


export default StatCard;