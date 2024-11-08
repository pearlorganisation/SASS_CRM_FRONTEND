export const LeadTypeOptions = [
    { value: "Hot", label: "Hot" },
    { value: "Mild", label: "Mild" },
    { value: "Cold", label: "Cold" },
  ];

export const getColor = (option) => {
  switch (option) {
    case "Hot":
      return "#ef4444"; // Orange
    case "Mild":
      return "#ffab00"; // Yellow
    case "Cold":
      return "#3b82f6"; // Blue
    default:
      return "white";
  }
};
