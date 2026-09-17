export const getProfileCompleteness = (user) => {
  if (!user) return { completed: 0, total: 7, percentage: 0 };

  const fields = [
    user.firstName,
    user.lastName,
    user.photoUrl,
    user.age,
    user.gender,
    user.about,
    Array.isArray(user.skills) && user.skills.length > 0,
  ];
  const completed = fields.filter(Boolean).length;
  const total = fields.length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};
