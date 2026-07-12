export function useChartTheme() {
  const colors = ['#7C3AED', '#A78BFA', '#C4B5FD', '#818CF8', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']
  return {
    colors,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, system-ui, sans-serif', color: '#6B7280' },
    title: { textStyle: { color: '#111827', fontWeight: 600 } },
    legend: { textStyle: { color: '#6B7280' } },
    tooltip: { backgroundColor: '#fff', borderColor: '#E5E7EB', textStyle: { color: '#111827' } },
    grid: { containLabel: true }
  }
}
