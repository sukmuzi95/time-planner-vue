export const getColorForUser = (userId) => {
  const palette = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];
  return palette[userId % palette.length];
};
