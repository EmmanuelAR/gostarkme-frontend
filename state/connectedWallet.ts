import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { atomWithStorage } from "jotai/utils";
import type { StarknetWindowObject } from "starknetkit";
import { connect } from "starknetkit";

export const walletStarknetkitLatestAtom = atomWithStorage<
	undefined | null | StarknetWindowObject
>(
	"walletStarknetkitLatest",
	undefined,
	{
		getItem: async (key: string) => {
			const value = localStorage.getItem(key);
			const jsonWallet =
				value && value !== "undefined" ? JSON.parse(value) : undefined;
			if (!jsonWallet) return undefined;
			const { wallet } = await connect({
				provider: provider,
				modalMode: "neverAsk",
				webWalletUrl: ARGENT_WEBWALLET_URL,
				argentMobileOptions: {
					dappName: "Starknetkit example dapp",
					url: window.location.hostname,
					chainId: CHAIN_ID,
					icons: [],
				},
			});
			return wallet?.isConnected ? wallet : undefined;
		},
		setItem: async (
			key: string,
			value: StarknetWindowObject | null | undefined,
		) => {
			localStorage.setItem(key, JSON.stringify(value));
		},
		removeItem: async (key: string) => {
			localStorage.removeItem(key);
		},
	},
	{
		getOnInit: true,
	},
);
