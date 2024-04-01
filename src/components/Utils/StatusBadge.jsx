const StatusBadge = (status) => {
  const statusClassSet = (status) => {
    let statusBG = "";
    if (status === "not_started") statusBG = "text-black bg-slate-400";
    if (status === "in_progress") statusBG = "text-black bg-amber-300";
    if (
      status === "approved" ||
      status === "completed" ||
      status === "active" ||
      status === "resolved"
    )
      statusBG = "text-white bg-green-500";
    if (status === "overdue" || status === "inactive" || status === "pending")
      statusBG = "text-white bg-rose-500";
    return `capitalize text-nowrap text-sm px-2 py-1 rounded-md  ${statusBG}`;
  };
  return (
    <span className={statusClassSet(status.status)}>
      {status.status.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
