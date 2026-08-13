export const date_formatter = (data: Date) => {
  const date = new Date(data);

  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const url_search = (
  url: string | null = null,
  term: string | null = null,
) => {
  if (!url || !term) return false;

  const url_arr = url.split("/");
  return url_arr.find((uri) => uri === term);
};
