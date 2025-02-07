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

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};