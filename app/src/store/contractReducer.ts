import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ArtDonate__factory } from "../typechain";
import { BigNumber, ethers } from "ethers";
import { DonateEvent, TransferSingleEvent } from "../typechain/ArtDonate";
import { coinsToEthers, ethersToCoins, isTxExist } from "../utils";
import config from "../config.json";
import { Item, ItemWithFeatures } from "../types";

const name = "contract";

interface ContractState {
  decimals: number;
  itemTransfers: TransferSingleEvent[];
  coinTransfers: TransferSingleEvent[];
  donations: DonateEvent[];
  items: Item[];
}

const initialState: ContractState = {
  decimals: 0,
  itemTransfers: [],
  coinTransfers: [],
  donations: [],
  items: [],
};

export const loadDecimals = createAsyncThunk(
  `${name}/decimals`,
  async (_, { getState }): Promise<number> => {
    const { provider } = (getState() as RootState).ethers;
    if (provider) {
      const contract = ArtDonate__factory.connect(
        config.contractAddress,
        provider
      );
      return contract.decimals();
    }
    return 0;
  }
);

export const mintCoins = createAsyncThunk(
  `${name}/mintCoins`,
  async (ethers: BigNumber, { getState }): Promise<void> => {
    const {
      snackbar: { enqueueSnackbar },
      ethers: { provider, signer },
      contract: { decimals },
    } = getState() as RootState;

    if (provider && signer && enqueueSnackbar && decimals) {
      const contract = ArtDonate__factory.connect(
        config.contractAddress,
        provider
      );
      try {
        await contract.connect(signer).mintCoins({
          value: ethers,
        });
        enqueueSnackbar(
          `Successfully minted ${ethersToCoins(
            ethers,
            decimals
          ).toString()} tokens`,
          { variant: "success" }
        );
      } catch (e) {
        enqueueSnackbar("Error when minting tokens", { variant: "error" });
      }
    }
  }
);

export const sellCoins = createAsyncThunk(
  `${name}/sellCoins`,
  async (coins: BigNumber, { getState }): Promise<void> => {
    const {
      snackbar: { enqueueSnackbar },
      ethers: { provider, signer },
      contract: { decimals },
    } = getState() as RootState;

    if (provider && signer && enqueueSnackbar && decimals) {
      const contract = ArtDonate__factory.connect(
        config.contractAddress,
        provider
      );
      try {
        await contract.connect(signer).sellCoins(coins);
        enqueueSnackbar(
          `Successfully sold ${ethersToCoins(
            coins,
            decimals
          ).toString()} tokens`,
          { variant: "success" }
        );
      } catch (e) {
        enqueueSnackbar("Error when selling tokens", { variant: "error" });
      }
    }
  }
);

export const mintItem = createAsyncThunk(
  `${name}/mintItem`,
  async (metadataHash: string, { getState }): Promise<void> => {
    const {
      snackbar: { enqueueSnackbar },
      ethers: { provider, signer },
    } = getState() as RootState;

    if (provider && signer && enqueueSnackbar) {
      const contract = ArtDonate__factory.connect(
        config.contractAddress,
        provider
      );
      try {
        await contract.connect(signer).mintItem(metadataHash);
        enqueueSnackbar("Item minted", { variant: "success" });
      } catch (e) {
        enqueueSnackbar("Error during item minting", { variant: "error" });
      }
    }
  }
);

export const donate = createAsyncThunk(
  `${name}/donate`,
  async (
    { itemId, amount }: { itemId: number; amount: number },
    { getState }
  ): Promise<void> => {
    const {
      snackbar: { enqueueSnackbar },
      ethers: { provider, signer },
      contract: { decimals },
    } = getState() as RootState;

    if (provider && signer && enqueueSnackbar && decimals) {
      const contract = ArtDonate__factory.connect(
        config.contractAddress,
        provider
      );
      try {
        await contract
          .connect(signer)
          .donate(itemId, coinsToEthers(BigNumber.from(amount), decimals));
        enqueueSnackbar(`Successfully donated ${amount} tokens`, {
          variant: "success",
        });
      } catch (e) {
        enqueueSnackbar("Error during donation", { variant: "error" });
      }
    }
  }
);

export const loadItem = createAsyncThunk(
  `${name}/loadItem`,
  async (itemId: number, { getState }): Promise<Item | false> => {
    const { provider } = (getState() as RootState).ethers;
    if (provider) {
      const contract = ArtDonate__factory.connect(
        config.contractAddress,
        provider
      );
      const uri = await contract.uri(itemId);
      return { id: itemId, uri };
    }
    return false;
  }
);

const contractSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCoinTransferEvents: (
      state,
      { payload }: PayloadAction<TransferSingleEvent[]>
    ) => {
      state.coinTransfers = payload;
    },
    setItemTransferEvents: (
      state,
      { payload }: PayloadAction<TransferSingleEvent[]>
    ) => {
      state.itemTransfers = payload;
    },
    setDonationEvents: (state, { payload }: PayloadAction<DonateEvent[]>) => {
      state.donations = payload;
    },
    pushCoinTransferEvent: (
      state,
      { payload }: PayloadAction<TransferSingleEvent>
    ) => {
      if (!isTxExist(state.coinTransfers, payload)) {
        state.coinTransfers.push(payload);
      }
    },
    pushItemTransferEvent: (
      state,
      { payload }: PayloadAction<TransferSingleEvent>
    ) => {
      if (!isTxExist(state.itemTransfers, payload)) {
        state.itemTransfers.push(payload);
      }
    },
    pushDonateEvent: (state, { payload }: PayloadAction<DonateEvent>) => {
      if (
        !state.donations.find(
          ({ transactionHash }) => transactionHash === payload.transactionHash
        )
      ) {
        state.donations.push(payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDecimals.fulfilled, (state, { payload }) => {
      state.decimals = payload;
    });
    builder.addCase(loadItem.fulfilled, (state, { payload }) => {
      if (payload) {
        if (!state.items.find(({ id }) => id === payload.id)) {
          state.items.push(payload);
        }
      }
    });
  },
});

export const {
  pushItemTransferEvent,
  pushCoinTransferEvent,
  pushDonateEvent,
  setItemTransferEvents,
  setCoinTransferEvents,
  setDonationEvents,
} = contractSlice.actions;

/**
 * Get decimals of fungible token
 * @param state
 */
export const selectDecimals = (state: RootState) => state.contract.decimals;

/**
 * Get all coin transfer events related to address
 * @param address
 */
export const selectAddressCoinTransfers =
  (address: string | null) => (state: RootState) =>
    address
      ? state.contract.coinTransfers.filter((transfer) =>
          [
            transfer.args.to.toLowerCase(),
            transfer.args.from.toLowerCase(),
          ].includes(address.toLowerCase())
        )
      : [];

/**
 * Get all coin purchases related to address
 * @param address
 */
export const selectAddressPurchaseCoinTransfers =
  (address: string | null) => (state: RootState) =>
    address
      ? state.contract.coinTransfers.filter(
          (transfer) =>
            transfer.args.to.toLowerCase() === address.toLowerCase() &&
            transfer.args.from === ethers.constants.AddressZero
        )
      : [];

/**
 * Get all coin sales related to address
 * @param address
 */
export const selectAddressSellCoinTransfers =
  (address: string | null) => (state: RootState) =>
    address
      ? state.contract.coinTransfers.filter(
          (transfer) =>
            transfer.args.from.toLowerCase() === address.toLowerCase() &&
            transfer.args.to === ethers.constants.AddressZero
        )
      : [];

/**
 * Get merged withdrawals/purchases
 * @param address
 */
export const selectAddressExchangeEvents =
  (address: string | null) => (state: RootState) =>
    address
      ? [
          ...selectAddressPurchaseCoinTransfers(address)(state),
          ...selectAddressSellCoinTransfers(address)(state),
        ]
      : [];

/**
 * Get all earned coin events related to address
 * @param address
 */
export const selectAddressEarnedCoinTransfers =
  (address: string | null) => (state: RootState) =>
    address
      ? state.contract.coinTransfers.filter(
          (transfer) =>
            transfer.args.to.toLowerCase() === address.toLowerCase() &&
            transfer.args.from !== ethers.constants.AddressZero
        )
      : [];

/**
 * Get all donation coin events related to address
 * @param address
 */
export const selectAddressDonatedCoinTransfers =
  (address: string | null) => (state: RootState) =>
    address
      ? state.contract.coinTransfers.filter(
          (transfer) =>
            transfer.args.from.toLowerCase() === address.toLowerCase() &&
            transfer.args.to !== ethers.constants.AddressZero
        )
      : [];

/**
 * Get balance of address
 * @param address
 */
export const selectBalance = (address: string | null) => (state: RootState) =>
  address
    ? ethersToCoins(
        // Calculate amount of all purchased tokens
        selectAddressPurchaseCoinTransfers(address)(state)
          .reduce((acc, curr) => acc.add(curr.args.value), BigNumber.from("0"))
          //Subs all withdrawals
          .sub(
            selectAddressSellCoinTransfers(address)(state).reduce(
              (acc, curr) => acc.add(curr.args.value),
              BigNumber.from("0")
            )
          )
          // Add all earned tokens
          .add(
            selectAddressEarnedCoinTransfers(address)(state).reduce(
              (acc, curr) => acc.add(curr.args.value),
              BigNumber.from("0")
            )
          )
          // Subs all donated tokens
          .sub(
            selectAddressDonatedCoinTransfers(address)(state).reduce(
              (acc, curr) => acc.add(curr.args.value),
              BigNumber.from("0")
            )
          ),
        state.contract.decimals
      ).toNumber()
    : 0;

/**
 * Get all minted NFT
 * @param state
 */
export const selectAllItems = (state: RootState) =>
  state.contract.itemTransfers
    .reduce<ItemWithFeatures[]>((acc, { args: { id, to: owner } }) => {
      const existItemIndex = acc.findIndex((item) => item.id === id.toNumber());
      if (existItemIndex !== -1) {
        acc[existItemIndex].owner = owner;
      } else {
        acc.push({
          id: id.toNumber(),
          owner,
          uri: selectItemUri(id)(state),
          earned: ethersToCoins(
            selectItemDonationEvents(id)(state).reduce<BigNumber>(
              (acc, curr) => acc.add(curr.args.amount),
              BigNumber.from(0)
            ),
            state.contract.decimals
          ).toNumber(),
        });
      }
      return acc;
    }, [])
    .sort((a, b) => (a.id > b.id ? -1 : 1));

/**
 * Get all items of selected address
 * @param address
 */
export const selectAddressItems =
  (address: string | null) => (state: RootState) =>
    address
      ? selectAllItems(state).filter(
          (item) => item.owner.toLowerCase() === address.toLowerCase()
        )
      : [];
/**
 * Get all item donation events
 * @param state
 */
export const selectItemDonations = (state: RootState) =>
  state.contract.donations;

/**
 * Get uri of selected item
 * @param itemId
 */
export const selectItemUri =
  (itemId: BigNumber) =>
  (state: RootState): string =>
    state.contract.items.find((item) => itemId.eq(BigNumber.from(item.id)))
      ?.uri || "";

/**
 * Get all donation events related to item
 * @param itemId
 */
export const selectItemDonationEvents =
  (itemId: BigNumber) =>
  (state: RootState): DonateEvent[] =>
    state.contract.donations.filter((event) => event.args.itemId.eq(itemId));

export default contractSlice.reducer;
