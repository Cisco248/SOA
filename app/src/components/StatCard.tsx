import "./_statcard.scss";

interface StatCardProps {
  label: string;
  value: number | string;
  sub: string;
  color: "amber" | "green" | "red" | "blue";
}

export const StatCard = ({ label, value, sub, color }: StatCardProps) => {
  return (
    <div className={`stat-card variables.${color} rivet-corners`}>
      <div className="rivet-br"></div>
      <div className="rivet-bl"></div>
      <div className="stat-label"> {label}</div>
      <div className={`stat-value variables.${color}`}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
};
