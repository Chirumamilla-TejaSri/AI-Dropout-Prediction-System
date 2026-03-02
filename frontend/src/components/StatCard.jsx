const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 
                    rounded-xl p-6 flex flex-col gap-2 
                    shadow-lg hover:shadow-xl transition">

      <div className="flex justify-between items-center">
        <p className="text-gray-400">{title}</p>
        {icon}
      </div>

      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>

      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;