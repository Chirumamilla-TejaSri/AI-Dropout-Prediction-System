const RecentPredictions = ({ predictions }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 
                    rounded-xl p-6 shadow-lg w-full">

      <h2 className="text-lg font-semibold mb-4 text-white">
        Recent Predictions
      </h2>

      <table className="w-full text-left">
        <thead className="text-gray-400 text-sm">
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Risk Level</th>
            <th>Confidence</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody className="text-white">
          {predictions.map((student, index) => (
            <tr key={index} className="border-t border-white/10">
              <td className="py-3">{student.name}</td>
              <td>{student.roll_no}</td>
              <td>{student.risk_level}</td>
              <td>{student.confidence}%</td>
              <td>{student.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentPredictions;