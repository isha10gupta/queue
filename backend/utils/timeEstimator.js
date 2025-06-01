// Simple time estimator based on pages count and fixed rate per page (e.g., 1 min/page)
exports.estimateTime = (pages) => {
  const timePerPage = 1; // minutes per page
  return pages * timePerPage;
};
