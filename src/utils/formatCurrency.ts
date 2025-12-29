export function formatCurrency(value: number | string | null | undefined): string {
	return `$${Number(value ?? 0).toFixed(2)}`;
}
