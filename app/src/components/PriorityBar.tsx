import { Order, LevelMethods } from "../constants/constant";
import "./_prioritybar.scss";

interface PriorityProps {
  priority: Order["priority"];
}

const priorityClasses: Record<string, string> = {
  LOW: "low",
  MEDIUM: "mid",
  HIGH: "high",
};

function PriorityBars({ priority }: PriorityProps) {
  const numericValue = LevelMethods[priority];
  const colorClass = priorityClasses[priority];

  return (
    <div className="priority-bar">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`priority-segment ${i <= numericValue ? colorClass : ""}`}
        ></div>
      ))}
    </div>
  );
}

export { PriorityBars };
