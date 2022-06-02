import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { RootState } from "../app/store";
import Moralis from "moralis";

const name = "ethers";

export enum ConnectionStatus {
  None,
  Pending,
  Fulfilled,
  Rejected,
}

interface EthersState {
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  address: string;
  status: ConnectionStatus;
}

const initialState: Partial<EthersState> = {
  status: ConnectionStatus.None,
};

export const connect = createAsyncThunk(
  `${name}/connect`,
  async (
    web3Provider: Moralis.EthersExternalProvider
  ): Promise<Partial<EthersState>> => {
    const provider = new ethers.providers.Web3Provider(web3Provider, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return { provider, signer, status: ConnectionStatus.Fulfilled, address };
  }
);

const ethersReducer = createSlice({
  name,
  initialState,
  reducers: {
    clear: (state) => {
      state.status = ConnectionStatus.None;
      state.signer = undefined;
      state.provider = undefined;
      state.address = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connect.pending, (state) => {
      state.status = ConnectionStatus.Pending;
    });
    builder.addCase(connect.rejected, (state) => {
      state.status = ConnectionStatus.Rejected;
    });
    builder.addCase(
      connect.fulfilled,
      (state, { payload: { signer, status, provider, address } }) => {
        state.status = status;
        state.signer = signer;
        state.address = address;
        state.provider = provider;
      }
    );
  },
});

export const { clear } = ethersReducer.actions;

export const selectProvider = (state: RootState) => state.ethers.provider;
export const selectSigner = (state: RootState) => state.ethers.signer;

export default ethersReducer.reducer;
