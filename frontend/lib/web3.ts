// Minimal ethers v6 helpers for browser usage
import { BrowserProvider, Contract, Eip1193Provider } from 'ethers'

export function getInjectedProvider(): Eip1193Provider | null {
	if (typeof window !== 'undefined' && (window as any).ethereum) {
		return (window as any).ethereum as Eip1193Provider
	}
	return null
}

export async function getProvider(): Promise<BrowserProvider> {
	const injected = getInjectedProvider()
	if (!injected) {
		throw new Error('No injected wallet found. Please install MetaMask or a compatible wallet.')
	}
	return new BrowserProvider(injected)
}

export async function getSigner() {
	const provider = await getProvider()
	return await provider.getSigner()
}

export async function getContract<T = any>(address: string, abi: any): Promise<Contract & T> {
	const signer = await getSigner()
	return new Contract(address, abi, signer) as unknown as Contract & T
}
