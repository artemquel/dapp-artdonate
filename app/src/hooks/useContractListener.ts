import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectProvider } from "../store/ethersReducer";
import { useEffect, useState } from "react";
import { ArtDonate, ArtDonate__factory } from "../typechain";
import {
  loadDecimals,
  loadItem,
  pushCoinTransferEvent,
  pushDonateEvent,
  pushItemTransferEvent,
  selectDecimals,
  setCoinTransferEvents,
  setDonationEvents,
  setItemTransferEvents,
} from "../store/contractReducer";
import config from "../config.json";

export const useContractListener = (): boolean => {
  const provider = useAppSelector(selectProvider);
  const decimals = useAppSelector(selectDecimals);
  const dispatch = useAppDispatch();

  const [contract, setContract] = useState<ArtDonate | null>(null);
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState(false);

  useEffect(() => {
    if (provider) {
      setContract(ArtDonate__factory.connect(config.contractAddress, provider));
      dispatch(loadDecimals());
    }
  }, [provider, dispatch]);

  useEffect(() => {
    if (contract && provider) {
      (async () => {
        const itemTypeCoin = await contract.ITEMTYPE_COIN();
        const transfersFilter = contract.filters.TransferSingle();
        const donateFilter = contract.filters.Donate();
        Promise.all([
          contract.queryFilter(transfersFilter, 0).then((events) => {
            dispatch(
              setCoinTransferEvents(
                events.filter((event) => event.args.id.eq(itemTypeCoin))
              )
            );
            dispatch(
              setItemTransferEvents(
                events
                  .filter((event) => !event.args.id.eq(itemTypeCoin))
                  .map((event) => {
                    dispatch(loadItem(event.args.id.toNumber()));
                    return event;
                  })
              )
            );
          }),
          contract
            .queryFilter(donateFilter, 0)
            .then((events) => dispatch(setDonationEvents(events))),
        ]).then(() => {
          setHistoricalDataLoaded(true);
        });

        provider.once("block", () => {
          contract.on(transfersFilter, (...args) => {
            const [, , , id, , event] = args;
            if (id.eq(itemTypeCoin)) {
              dispatch(pushCoinTransferEvent(event));
            } else {
              dispatch(loadItem(id.toNumber()));
              dispatch(pushItemTransferEvent(event));
            }
          });
          contract.on(donateFilter, (...args) => {
            const [, , , event] = args;
            dispatch(pushDonateEvent(event));
          });
        });
      })();
    }
  }, [contract, provider, dispatch]);

  return !!decimals && historicalDataLoaded;
};
