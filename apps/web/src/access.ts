/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canPilot: currentUser && currentUser.access === 'ai_assistant',
    canDashboard:
      currentUser && ['admin', 'ai_assistant'].includes(currentUser.access),
  };
}
