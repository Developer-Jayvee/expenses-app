export const date_formatter = (data: Date) => {
  const date = new Date(data);

  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
