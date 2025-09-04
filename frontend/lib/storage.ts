export interface DemoTokenMeta {
	address: string
	name: string
	symbol: string
	creator?: string
	createdAt: number
}

const KEY = 'demoTokens'

export function loadDemoTokens(): DemoTokenMeta[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = window.localStorage.getItem(KEY)
		return raw ? (JSON.parse(raw) as DemoTokenMeta[]) : []
	} catch {
		return []
	}
}

export function saveDemoToken(token: DemoTokenMeta) {
	if (typeof window === 'undefined') return
	const list = loadDemoTokens()
	list.unshift(token)
	window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)))
}
