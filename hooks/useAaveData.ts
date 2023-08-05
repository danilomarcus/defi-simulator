import { useEffect, useState } from "react";
import { useHookstate, State } from "@hookstate/core";
import * as pools from "@bgd-labs/aave-address-book";

import { HealthFactorDataStore } from "../store/healthFactorDataStore";

import { ChainId } from "@aave/contract-helpers";
import BigNumber from "bignumber.js";

export type HealthFactorData = {
  address: string;
  fetchError: string;
  isFetching: boolean;
  lastFetched: number;
  market: AaveMarketDataType;
  marketReferenceCurrencyPriceInUSD: number;
  availableAssets?: AssetDetails[];
  fetchedData?: AaveHealthFactorData;
  workingData?: AaveHealthFactorData;
};

export type AaveHealthFactorData = {
  address?: string;
  healthFactor: number;
  totalBorrowsUSD: number;
  availableBorrowsUSD: number;
  totalCollateralMarketReferenceCurrency: number;
  totalBorrowsMarketReferenceCurrency: number;
  currentLiquidationThreshold: number;
  currentLoanToValue: number;
  userReservesData: ReserveAssetDataItem[];
  userBorrowsData: BorrowedAssetDataItem[];
  userEmodeCategoryId?: number;
  isInIsolationMode?: boolean;
};

export type ReserveAssetDataItem = {
  asset: AssetDetails;
  underlyingBalance: number;
  underlyingBalanceUSD: number;
  underlyingBalanceMarketReferenceCurrency: number;
  usageAsCollateralEnabledOnUser: boolean;
};

export type BorrowedAssetDataItem = {
  asset: AssetDetails;
  stableBorrows?: number;
  variableBorrows?: number;
  totalBorrows: number;
  totalBorrowsUSD: number;
  totalBorrowsMarketReferenceCurrency: number;
};

export type AssetDetails = {
  symbol: string;
  name: string;
  priceInUSD: number;
  priceInMarketReferenceCurrency: number;
  baseLTVasCollateral: number;
  isActive?: boolean;
  isFrozen?: boolean;
  isIsolated?: boolean;
  isPaused?: boolean;
  reserveLiquidationThreshold: number;
  reserveFactor: number;
  usageAsCollateralEnabled: boolean;
  initialPriceInUSD: number;
  aTokenAddress?: string;
  stableDebtTokenAddress?: string;
  variableDebtTokenAddress?: string;
  isNewlyAddedBySimUser?: boolean;
  borrowingEnabled?: boolean;
  liquidityIndex?: number;
  variableBorrowIndex?: number;
  liquidityRate?: number;
  variableBorrowRate?: number;
  stableBorrowRate?: number;
  interestRateStrategyAddress?: number;
  availableLiquidity?: number;
  borrowCap?: number;
  supplyCap?: number;
  eModeLtv?: number;
  eModeLiquidationThreshold?: number;
  eModeLabel?: string;
  borrowableInIsolation?: boolean;
  isSiloedBorrowing?: boolean;
  totalDebt?: number;
  totalStableDebt?: number;
  totalVariableDebt?: number;
  totalLiquidity?: number;
};

/**
 * left to borrow = borrowCap - totalDebt
 * left to supply = supplyCap - totalLiquidity
 *
 * baseLTVasCollateral
 * reserveLiquidationThreshold
 *
 * isFrozen
 * isPaused
 * usageAsCollateralEnabled
 *
 * borrowingEnabled
 * borrowCap
 * supplyCap
 * eModeLtv
 * eModeLiquidationThreshold
 */

export type AaveMarketDataType = {
  v3?: boolean;
  id: string;
  title: string;
  chainId: ChainId;
  api: string;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    UI_POOL_DATA_PROVIDER: string;
  };
};

export const markets: AaveMarketDataType[] = [
  {
    v3: false,
    id: "ETHEREUM_V2",
    title: "Ethereum v2",
    chainId: ChainId.mainnet,
    api: "https://eth-mainnet.alchemyapi.io/v2/{{ALCHEMY_API_KEY}}",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV2Ethereum.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV2Ethereum.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: true,
    id: "ETHEREUM_V3",
    title: "Ethereum v3",
    chainId: ChainId.mainnet,
    api: "https://eth-mainnet.alchemyapi.io/v2/{{ALCHEMY_API_KEY}}",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: true,
    id: "ARBITRUM_V3",
    title: "Arbitrum v3",
    chainId: ChainId.arbitrum_one,
    api: "https://arb-mainnet.g.alchemy.com/v2/{{ALCHEMY_API_KEY}}",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV3Arbitrum.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV3Arbitrum.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: true,
    id: "OPTIMISM_V3",
    title: "Optimism v3",
    chainId: ChainId.optimism,
    api: "https://opt-mainnet.g.alchemy.com/v2/{{ALCHEMY_API_KEY}}",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV3Optimism.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV3Optimism.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: false,
    id: "POLYGON_V2",
    title: "Polygon v2",
    chainId: ChainId.polygon,
    api: "https://polygon-mainnet.g.alchemy.com/v2/{{ALCHEMY_API_KEY}}",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV2Polygon.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV2Polygon.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: true,
    id: "POLYGON_V3",
    title: "Polygon v3",
    chainId: ChainId.polygon,
    api: "https://polygon-mainnet.g.alchemy.com/v2/{{ALCHEMY_API_KEY}}",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV3Polygon.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV3Polygon.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: false,
    id: "AVALANCHE_V2",
    title: "Avalanche v2",
    chainId: ChainId.avalanche,
    api: "https://api.avax.network/ext/bc/C/rpc",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV2Avalanche.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV2Avalanche.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: true,
    id: "AVALANCHE_V3",
    title: "Avalanche v3",
    chainId: ChainId.avalanche,
    api: "https://api.avax.network/ext/bc/C/rpc",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        pools.AaveV3Avalanche.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV3Avalanche.UI_POOL_DATA_PROVIDER,
    },
  },
  {
    v3: true,
    id: "METIS_V3",
    title: "Metis v3",
    chainId: ChainId.metis_andromeda,
    api: "https://andromeda.metis.io/?owner=1088",
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: pools.AaveV3Metis.POOL_ADDRESSES_PROVIDER,
      UI_POOL_DATA_PROVIDER: pools.AaveV3Metis.UI_POOL_DATA_PROVIDER,
    },
  },
];

/** hook to fetch user aave data
 * @returns { currentAddress,
    currentMarket,
    addressData,
    addressDataStore,
    afterAssetsChanged,
    addBorrowAsset,
    addReserveAsset,
    setCurrentMarket, }
 */
export function useAaveData(address: string) {
  const [isFetching, setIsFetching] = useState(false);
  const store = useHookstate(HealthFactorDataStore);
  const state = store.get({ noproxy: true });
  const { currentAddress, addressData, currentMarket } = state;
  const data = addressData?.[currentAddress];
  const addressProvided = address && address.length > 0;
  if (address?.length === 0) address = currentAddress || "";

  const isLoadingAny = !!markets.find(
    (market) => !!data?.[market.id]?.isFetching
  );

  useEffect(() => {
    if (addressProvided && !isLoadingAny) {
      markets.map((market) => {
        const existingData = data?.[market.id];
        const lastFetched = existingData?.lastFetched;
        // Consider stale and re-fetch if more than 30 seconds old
        if (lastFetched && lastFetched > Date.now() - 30000) return;
        if (existingData?.isFetching) return;
        setIsFetching(true);
        createInitial(market);
        const fetchData = async () => {
          const options = {
            method: "POST",
            body: JSON.stringify({ address, marketId: market.id }),
          };
          const response: Response = await fetch("/api/aave", options);
          const hfData: HealthFactorData = await response.json();
          store.addressData.nested(address).merge({ [market.id]: hfData });
        };
        fetchData();
      });
    }
  }, [currentAddress, addressProvided, isLoadingAny]);

  useEffect(() => {
    if (address) store.currentAddress.set(address);
  }, [address]);

  useEffect(() => {
    if (!isFetching) return;
    if (!markets.find((market) => data?.[market.id]?.isFetching)) {
      setIsFetching(false);
    }
  }, [isLoadingAny]);

  // After fetching, if the current market doesn't have a position but another
  // one does, select the market that has a position (prefer highest reserve balance).
  useEffect(() => {
    if (!isFetching && addressProvided) {
      const currentMarketHasPosition =
        data?.[currentMarket].workingData?.healthFactor &&
        (data?.[currentMarket]?.workingData?.healthFactor ?? -1) > -1;

      const currentMarketHasEdits =
        data?.[currentMarket]?.workingData?.healthFactor?.toFixed(2) !==
        data?.[currentMarket]?.fetchedData?.healthFactor?.toFixed(2);

      // Don't perform the auto-select if the user is actively editing the current market.
      if (currentMarketHasPosition && currentMarketHasEdits) return;

      const marketWithPosition = markets
        .sort((marketA, marketB) => {
          const marketDataA = data?.[marketA.id];
          const marketDataB = data?.[marketB.id];

          const totalCollA =
            marketDataA?.workingData?.totalCollateralMarketReferenceCurrency ||
            0;
          const totalCollB =
            marketDataB?.workingData?.totalCollateralMarketReferenceCurrency ||
            0;

          const priceA = marketDataA?.marketReferenceCurrencyPriceInUSD || 0;
          const priceB = marketDataB?.marketReferenceCurrencyPriceInUSD || 0;

          return totalCollB * priceB - totalCollA * priceA;
        })
        .find(
          (market) =>
            data?.[market.id]?.workingData?.healthFactor &&
            (data?.[market.id]?.workingData?.healthFactor ?? -1) > -1
        );
      // This guard doesn't make much sense but for some reason this useEffect was being triggered
      // sometimes even when the markets hadn't just finished loading. We only want to apply
      // this logic right after loading.
      const didFetchRecently = !!markets.find(
        (market) => data?.[market.id]?.lastFetched > Date.now() - 1000
      );
      if (marketWithPosition && didFetchRecently) {
        setCurrentMarket(marketWithPosition.id);
      }
    }
  }, [isFetching]);

  const createInitial = (market: AaveMarketDataType) => {
    const hf: HealthFactorData = {
      address,
      fetchError: "",
      isFetching: true,
      lastFetched: 0,
      market,
      marketReferenceCurrencyPriceInUSD: 0,
    };
    store.addressData.nested(address).merge({ [market.id]: hf });
  };

  const setCurrentMarket = (marketId: string) => {
    store.currentMarket.set(marketId);
  };

  const addBorrowAsset = (symbol: string) => {
    const asset = data[currentMarket].availableAssets?.find(
      (a) => a.symbol === symbol
    ) as AssetDetails;

    asset.isNewlyAddedBySimUser = true;

    const borrow: BorrowedAssetDataItem = {
      asset,
      totalBorrows: 0,
      totalBorrowsUSD: 0,
      totalBorrowsMarketReferenceCurrency: 0,
    };

    const workingData = store.addressData.nested(address)?.[currentMarket]
      .workingData as State<AaveHealthFactorData>;

    workingData.userBorrowsData.merge([borrow]);
  };

  const addReserveAsset = (symbol: string) => {
    const asset: AssetDetails = data[currentMarket].availableAssets?.find(
      (a) => a.symbol === symbol
    ) as AssetDetails;

    asset.isNewlyAddedBySimUser = true;

    const reserve: ReserveAssetDataItem = {
      asset,
      underlyingBalance: 0,
      underlyingBalanceUSD: 0,
      underlyingBalanceMarketReferenceCurrency: 0,
      usageAsCollateralEnabledOnUser: asset.usageAsCollateralEnabled,
    };

    const workingData = store.addressData.nested(address)[currentMarket]
      .workingData as State<AaveHealthFactorData>;
    workingData.userReservesData.merge([reserve]);
  };

  const removeAsset = (symbol: string, assetType: string) => {
    const items =
      assetType === "RESERVE"
        ? data?.[currentMarket]?.workingData?.userReservesData || []
        : data?.[currentMarket]?.workingData?.userBorrowsData || [];

    const itemIndex = items.findIndex((item) => item.asset.symbol === symbol);
    const workingData = store.addressData.nested(address)[currentMarket]
      .workingData as State<AaveHealthFactorData>;
    const reserves: State<ReserveAssetDataItem[]> =
      workingData.userReservesData;
    const borrows: State<BorrowedAssetDataItem[]> = workingData.userBorrowsData;

    assetType === "RESERVE"
      ? reserves.set((p) => {
          p.splice(itemIndex, 1);
          return p;
        })
      : borrows.set((p) => {
          p.splice(itemIndex, 1);
          return p;
        });

    updateAllDerivedHealthFactorData();
  };

  const resetCurrentMarketChanges = () => {
    store.addressData.nested(address)?.[currentMarket].workingData.set(
      JSON.parse(
        JSON.stringify(
          store.addressData[currentAddress][currentMarket].fetchedData.get({
            noproxy: true,
          })
        )
      )
    );
    updateAllDerivedHealthFactorData();
  };

  const setBorrowedAssetQuantity = (symbol: string, quantity: number) => {
    const workingData = store.addressData.nested(address)[currentMarket]
      .workingData as State<AaveHealthFactorData>;
    const item = workingData?.userBorrowsData.find(
      (item) => item.asset.symbol.get() === symbol
    );
    if (item?.totalBorrows.get() !== quantity) {
      item?.totalBorrows.set(quantity);
      updateAllDerivedHealthFactorData();
    }
  };

  const setReserveAssetQuantity = (symbol: string, quantity: number) => {
    const workingData = store.addressData.nested(address)[currentMarket]
      .workingData as State<AaveHealthFactorData>;
    const item = workingData?.userReservesData.find(
      (item) => item.asset.symbol.get() === symbol
    );

    if (item?.underlyingBalance.get() !== quantity) {
      item?.underlyingBalance.set(quantity);
      updateAllDerivedHealthFactorData();
    }
  };

  const setAssetPriceInUSD = (symbol: string, price: number) => {
    const workingData = store.addressData.nested(address)[currentMarket]
      .workingData as State<AaveHealthFactorData>;
    const reserveItem = workingData?.userReservesData.find(
      (item) => item.asset.symbol.get() === symbol
    );
    if (reserveItem && reserveItem?.asset.priceInUSD.get() !== price)
      reserveItem.asset.priceInUSD.set(price);

    const borrowItem = workingData?.userBorrowsData.find(
      (item) => item.asset.symbol.get() === symbol
    );
    if (borrowItem && borrowItem?.asset.priceInUSD.get() !== price)
      borrowItem.asset.priceInUSD.set(price);
    updateAllDerivedHealthFactorData();
  };

  const applyLiquidationScenario = () => {
    const liquidationScenario = getCalculatedLiquidationScenario(
      data?.[currentMarket]?.workingData as AaveHealthFactorData,
      data?.[currentMarket]?.marketReferenceCurrencyPriceInUSD
    ) as AssetDetails[];
    liquidationScenario?.forEach((asset) =>
      setAssetPriceInUSD(asset.symbol, asset.priceInUSD)
    );
  };

  const setUseReserveAssetAsCollateral = (symbol: string, value: boolean) => {
    const workingData = store.addressData.nested(address)[currentMarket]
      .workingData as State<AaveHealthFactorData>;
    const reserveItem = workingData?.userReservesData.find(
      (item) => item.asset.symbol.get() === symbol
    );
    if (
      reserveItem &&
      reserveItem?.usageAsCollateralEnabledOnUser.get() !== value
    )
      reserveItem.usageAsCollateralEnabledOnUser.set(value);

    updateAllDerivedHealthFactorData();
  };

  const setCurrentAddress = (address: string) => {
    store.currentAddress.set(address);
  };

  const updateAllDerivedHealthFactorData = () => {
    const currentMarketReferenceCurrencyPriceInUSD: number = store.addressData
      .nested(address)
      [currentMarket].marketReferenceCurrencyPriceInUSD.get();

    const healthFactorItem = store.addressData.nested(address)?.[
      currentMarket
    ] as State<HealthFactorData>;

    const workingData = healthFactorItem.workingData.get({
      noproxy: true,
    }) as AaveHealthFactorData;

    const updatedWorkingData: AaveHealthFactorData =
      updateDerivedHealthFactorData(
        workingData,
        currentMarketReferenceCurrencyPriceInUSD
      );

    healthFactorItem.workingData.set(updatedWorkingData);
  };

  //console.log({ data })

  return {
    isFetching: isLoadingAny,
    currentAddress,
    currentMarket,
    addressData: data,
    addressDataStore: store.addressData?.[currentAddress],
    removeAsset,
    resetCurrentMarketChanges,
    addBorrowAsset,
    addReserveAsset,
    setCurrentMarket,
    setCurrentAddress,
    setBorrowedAssetQuantity,
    setReserveAssetQuantity,
    setAssetPriceInUSD,
    applyLiquidationScenario,
    setUseReserveAssetAsCollateral,
  };
}

/**
 *
 *  *** Aave-specific Utility Functions ***
 *
 */

export const getHealthFactorColor = (hf: number = 0) => {
  return hf < 1.1 ? "red" : hf > 3 ? "green" : "yellow";
};

export const isStablecoinAsset = (asset: AssetDetails) => {
  const symbol = asset.symbol?.toUpperCase();
  return (
    symbol?.includes("DAI") || symbol?.includes("USD") || symbol.includes("GHO")
  );
};

export const getEligibleLiquidationScenarioReserves = (
  hfData: AaveHealthFactorData
) => {
  const MINIMUM_CUMULATIVE_RESERVE_USD = 50;
  const MINIMUM_CUMULATIVE_RESERVE_PCT = 5;

  const eligibleReserves: ReserveAssetDataItem[] =
    hfData.userReservesData.filter((reserve: ReserveAssetDataItem) => {
      const isStableCoin = isStablecoinAsset(reserve.asset);
      const isCollateralEnabled = !!reserve.usageAsCollateralEnabledOnUser;
      return !isStableCoin && isCollateralEnabled;
    }) || [];

  let cumulativeReserveUSDValue = 0;
  let cumulativeReserveMRCValue = 0;

  eligibleReserves.forEach((reserve) => {
    cumulativeReserveUSDValue += reserve.underlyingBalanceUSD;
    cumulativeReserveMRCValue +=
      reserve.underlyingBalanceMarketReferenceCurrency;
  });

  const exceedsMinResPct: boolean =
    cumulativeReserveMRCValue >
    hfData.totalCollateralMarketReferenceCurrency *
      (MINIMUM_CUMULATIVE_RESERVE_PCT / 100);
  const exceedsMinResUSD: boolean =
    cumulativeReserveUSDValue > MINIMUM_CUMULATIVE_RESERVE_USD;

  const hasSufficientValue = exceedsMinResPct && exceedsMinResUSD;

  if (!hasSufficientValue) return [];

  // in order for the non-stable reserves to be eligible for a liquidation scenario,
  // there must be at least one borrowed asset that is not included in the
  // eligible reserve assets.
  const hasDifferentBorrowedAsset: boolean =
    !!hfData.userBorrowsData.length &&
    !!hfData.userBorrowsData.find(
      (borrowItem: BorrowedAssetDataItem) =>
        !eligibleReserves.find((reserveItem: ReserveAssetDataItem) => {
          return reserveItem.asset.symbol === borrowItem.asset.symbol;
        })
    );

  return hasDifferentBorrowedAsset ? eligibleReserves : [];
};

/**
 * Assuming that the userReservesData or userBorrowsData has been updated in one of the following ways:
 *
 * - A userReservesData item has been added or removed
 * - A userBorrowsData item has been added or removed
 * - A userReservesData item.underlyingBalance has been modified
 * - A userReservesData item.asset.priceInUSD has been modified
 * - A userBorrowsData item.totalBorrows has been modified
 * - A userBorrowsData item.asset.priceInUSD has been modified
 *
 * This function will update all of the following derived data attributes if the value should change as a
 * result of one or more of the above item updates:
 *
 * (userReservesData) item.asset.priceInMarketReferenceCurrency (priceInUSD / marketReferenceCurrencyPriceInUSD)
 * (userReservesData) item.underlyingBalanceMarketReferenceCurrency (reserveData.priceInMarketReferenceCurrency * underlyingBalance)
 * (userReservesData) item.underlyingBalanceUSD (underlyingBalance * priceInUSD)
 * (userBorrowsData) item.totalBorrowsMarketReferenceCurrency (reserveData.priceInMarketReferenceCurrency * totalBorrows)
 * (userBorrowsData) item.totalBorrowsUSD (totalBorrows * asset.priceInUSD)
 * totalCollateralMarketReferenceCurrency
 * currentLiquidationThreshold
 * currentLoanToValue
 * healthFactor
 * availableBorrowsUSD
 *
 * @param hfData the healthFactorData to update
 * @returns hfData the updated healthFactorData
 */
export const updateDerivedHealthFactorData = (
  data: AaveHealthFactorData,
  currentMarketReferenceCurrencyPriceInUSD: number
) => {
  let updatedCurrentLiquidationThreshold: BigNumber = new BigNumber(0);
  let updatedCurrentLoanToValue: BigNumber = new BigNumber(0);
  let updatedHealthFactor: BigNumber = new BigNumber(0);
  let updatedAvailableBorrowsUSD: BigNumber = new BigNumber(0);
  let updatedAvailableBorrowsMarketReferenceCurrency: BigNumber = new BigNumber(
    0
  );
  let updatedTotalBorrowsUSD: BigNumber = new BigNumber(0);

  let updatedCollateral: BigNumber = new BigNumber(0);
  let weightedReservesETH: BigNumber = new BigNumber(0);
  let weightedLTVETH: BigNumber = new BigNumber(0);
  let totalBorrowsETH: BigNumber = new BigNumber(0);

  data.userReservesData.forEach((reserveItem) => {
    const underlyingBalance: BigNumber = new BigNumber(
      reserveItem.underlyingBalance
    );
    const priceInUSD: BigNumber = new BigNumber(reserveItem.asset.priceInUSD);

    // Update reserveItem.priceInMarketReferenceCurrency
    const existingPriceInMarketReferenceCurrency = new BigNumber(
      reserveItem.asset.priceInMarketReferenceCurrency
    );
    const updatedMarketReferenceCurrency = priceInUSD.dividedBy(
      currentMarketReferenceCurrencyPriceInUSD
    );
    if (
      !existingPriceInMarketReferenceCurrency.isEqualTo(
        updatedMarketReferenceCurrency
      )
    ) {
      reserveItem.asset.priceInMarketReferenceCurrency =
        updatedMarketReferenceCurrency.toNumber();
    }

    // Update reserveItem.underlyingBalanceMarketReferenceCurrency
    const existingUnderlyingBalanceMarketReferenceCurrency: BigNumber =
      new BigNumber(reserveItem.underlyingBalanceMarketReferenceCurrency);
    const updatedUnderlyingBalanceMarketReferenceCurrency =
      updatedMarketReferenceCurrency.multipliedBy(underlyingBalance);
    if (
      !existingUnderlyingBalanceMarketReferenceCurrency.isEqualTo(
        updatedUnderlyingBalanceMarketReferenceCurrency
      )
    ) {
      reserveItem.underlyingBalanceMarketReferenceCurrency =
        updatedUnderlyingBalanceMarketReferenceCurrency.toNumber();
    }

    // Update reserveItem.underlyingBalanceUSD
    const existingUnderlyingBalanceUSD = new BigNumber(
      reserveItem.underlyingBalanceUSD
    );
    const updatedUnderlyingBalanceUSD =
      underlyingBalance.multipliedBy(priceInUSD);
    if (!existingUnderlyingBalanceUSD.isEqualTo(updatedUnderlyingBalanceUSD)) {
      reserveItem.underlyingBalanceUSD = updatedUnderlyingBalanceUSD.toNumber();
    }

    // Update the necessary accumulated values for updating healthFactor etc.
    if (reserveItem.usageAsCollateralEnabledOnUser) {
      updatedCollateral = updatedCollateral.plus(
        updatedUnderlyingBalanceMarketReferenceCurrency
      );

      const itemReserveLiquidationThreshold: BigNumber = new BigNumber(
        reserveItem.asset.reserveLiquidationThreshold
      ).dividedBy(10000);
      const itemBaseLoanToValue: BigNumber = new BigNumber(
        reserveItem.asset.baseLTVasCollateral
      ).dividedBy(10000);

      weightedReservesETH = weightedReservesETH.plus(
        itemReserveLiquidationThreshold.multipliedBy(
          updatedUnderlyingBalanceMarketReferenceCurrency
        )
      );
      weightedLTVETH = weightedLTVETH.plus(
        itemBaseLoanToValue.multipliedBy(
          updatedUnderlyingBalanceMarketReferenceCurrency
        )
      );
    }
  });

  data.userBorrowsData.forEach((borrowItem) => {
    const totalBorrows: BigNumber = new BigNumber(borrowItem.totalBorrows);
    const priceInUSD: BigNumber = new BigNumber(borrowItem.asset.priceInUSD);

    // Update borrowItem.priceInMarketReferenceCurrency
    const existingPriceInMarketReferenceCurrency = new BigNumber(
      borrowItem.asset.priceInMarketReferenceCurrency
    );
    const updatedMarketReferenceCurrency = priceInUSD.dividedBy(
      currentMarketReferenceCurrencyPriceInUSD
    );
    if (
      !existingPriceInMarketReferenceCurrency.isEqualTo(
        updatedMarketReferenceCurrency
      )
    ) {
      borrowItem.asset.priceInMarketReferenceCurrency =
        updatedMarketReferenceCurrency.toNumber();
    }

    // Update borrowItem.totalBorrowsMarketReferenceCurrency
    const existingTotalBorrowsMarketReferenceCurrency: BigNumber =
      new BigNumber(borrowItem.totalBorrowsMarketReferenceCurrency);
    const updatedTotalBorrowsMarketReferenceCurrency =
      updatedMarketReferenceCurrency.multipliedBy(totalBorrows);
    if (
      !existingTotalBorrowsMarketReferenceCurrency.isEqualTo(
        updatedTotalBorrowsMarketReferenceCurrency
      )
    ) {
      borrowItem.totalBorrowsMarketReferenceCurrency =
        updatedTotalBorrowsMarketReferenceCurrency.toNumber();
    }

    // Update borrowItem.totalBorrowsUSD
    const existingTotalBorrowsUSD = new BigNumber(borrowItem.totalBorrowsUSD);
    const updatedTotalBorrowsUSD = totalBorrows.multipliedBy(priceInUSD);
    if (!existingTotalBorrowsUSD.isEqualTo(updatedTotalBorrowsUSD)) {
      borrowItem.totalBorrowsUSD = updatedTotalBorrowsUSD.toNumber();
    }

    // Update the necessary accumulated values for updating healthFactor etc.
    totalBorrowsETH = totalBorrowsETH.plus(
      updatedTotalBorrowsMarketReferenceCurrency
    );
  });

  // Update "totalCollateralMarketReferenceCurrency"
  if (
    !updatedCollateral.isEqualTo(
      new BigNumber(data.totalCollateralMarketReferenceCurrency)
    )
  ) {
    data.totalCollateralMarketReferenceCurrency = updatedCollateral.toNumber();
  }

  // Update "totalBorrowsMarketReferenceCurrency"
  if (
    !totalBorrowsETH.isEqualTo(
      new BigNumber(data.totalBorrowsMarketReferenceCurrency)
    )
  ) {
    data.totalBorrowsMarketReferenceCurrency = totalBorrowsETH.toNumber();
  }

  // Updated "currentLiquidationThreshold"
  if (
    weightedReservesETH.isGreaterThan(0) &&
    updatedCollateral.isGreaterThan(0)
  ) {
    updatedCurrentLiquidationThreshold =
      weightedReservesETH.dividedBy(updatedCollateral);
  }

  if (
    !updatedCurrentLiquidationThreshold.isEqualTo(
      new BigNumber(data.currentLiquidationThreshold)
    )
  ) {
    data.currentLiquidationThreshold =
      updatedCurrentLiquidationThreshold.toNumber();
  }

  // Update "currentLoanToValue"
  if (weightedLTVETH.isGreaterThan(0) && updatedCollateral.isGreaterThan(0)) {
    updatedCurrentLoanToValue = weightedLTVETH.dividedBy(updatedCollateral);
  }
  if (
    !updatedCurrentLoanToValue.isEqualTo(new BigNumber(data.currentLoanToValue))
  ) {
    data.currentLoanToValue = updatedCurrentLoanToValue.toNumber();
  }

  // Update "healthFactor"
  if (
    updatedCollateral.isGreaterThan(0) &&
    totalBorrowsETH.isGreaterThan(0) &&
    updatedCurrentLiquidationThreshold.isGreaterThan(0)
  ) {
    updatedHealthFactor = updatedCollateral
      .multipliedBy(updatedCurrentLiquidationThreshold)
      .dividedBy(totalBorrowsETH);
  } else if (totalBorrowsETH.isEqualTo(0)) {
    updatedHealthFactor = new BigNumber(Infinity);
  }

  if (!updatedHealthFactor.isEqualTo(new BigNumber(data.healthFactor))) {
    data.healthFactor = updatedHealthFactor.toNumber();
  }

  // Update "availableBorrowsUSD"
  updatedAvailableBorrowsMarketReferenceCurrency = updatedCollateral
    .multipliedBy(updatedCurrentLoanToValue)
    .minus(totalBorrowsETH);
  updatedAvailableBorrowsUSD =
    updatedAvailableBorrowsMarketReferenceCurrency.multipliedBy(
      currentMarketReferenceCurrencyPriceInUSD
    );

  if (updatedAvailableBorrowsUSD.isLessThan(0))
    updatedAvailableBorrowsUSD = new BigNumber(0);

  if (
    !updatedAvailableBorrowsUSD.isEqualTo(
      new BigNumber(data.availableBorrowsUSD)
    )
  ) {
    data.availableBorrowsUSD = updatedAvailableBorrowsUSD.toNumber();
  }

  // Update "totalBorrowsUSD"
  updatedTotalBorrowsUSD = totalBorrowsETH.multipliedBy(
    currentMarketReferenceCurrencyPriceInUSD
  );

  if (!updatedTotalBorrowsUSD.isEqualTo(new BigNumber(data.totalBorrowsUSD))) {
    data.totalBorrowsUSD = updatedTotalBorrowsUSD.toNumber();
  }

  return data;
};

/**
 *
 * @param hfData AaveHealthFactorData
 * @param currentMarketReferenceCurrencyPriceInUSD number
 * @returns AssetDetails[]
 *
 * Given a working position, return assets with updated priceInUSD that when applied would result in an hf ~1.00
 *
 */
export const getCalculatedLiquidationScenario = (
  hfData: AaveHealthFactorData,
  currentMarketReferenceCurrencyPriceInUSD: number
) => {
  if (!hfData) return [];
  // deep clone to avoid mutating state
  hfData = JSON.parse(JSON.stringify(hfData)) as AaveHealthFactorData;

  const reserves: ReserveAssetDataItem[] =
    getEligibleLiquidationScenarioReserves(hfData);

  let assets: AssetDetails[] = reserves.map(
    (res: ReserveAssetDataItem) => res.asset
  );

  let hf: number = hfData?.healthFactor || -1;

  const HF_LIMIT: number = 1.0049999999999;

  if (!assets.length || hf === Infinity || hf === -1) return [];

  // If the rounded hf === 1.00, just use the current asset prices since they represent a valid liquidation scenario.
  if (Math.round((hf + Number.EPSILON) * 100) / 100 === 1.0) {
    return assets;
  }

  // We're going to somewhat naively (and inefficiently) loop while we iteratively manipulate the asset
  // price until we get a HF that approaches ~1.00. While there is definitely more efficient
  // means of calculating the asset prices that would result in a hf of ~1.00, handling all the edge
  // cases with that approach proved rather elusive.

  let i = 0;

  // I don't expect this limit to get approached, but just in case things go haywire, don't let the app crash.
  const SHORT_CIRCUIT_LOOP_LIMIT = 500;

  // First, if we're below the HF_LIMIT, iteratively increase the price until hf > HF_LIMIT
  while (hf < HF_LIMIT && i < SHORT_CIRCUIT_LOOP_LIMIT) {
    i++;

    assets.forEach((asset) => {
      let priceIncrement = (asset.priceInUSD || 1) * 0.1;

      priceIncrement =
        Math.round((priceIncrement + Number.EPSILON) * 100) / 100;

      asset.priceInUSD = asset.priceInUSD + priceIncrement;

      const reserveItemAsset = hfData.userReservesData.find(
        (item) => item.asset.symbol === asset.symbol
      );

      if (reserveItemAsset)
        reserveItemAsset.asset.priceInUSD = asset.priceInUSD;

      const borrowItemAsset = hfData.userBorrowsData.find(
        (item) => item.asset.symbol === asset.symbol
      );

      if (borrowItemAsset) borrowItemAsset.asset.priceInUSD = asset.priceInUSD;

      const updatedWorkingData = updateDerivedHealthFactorData(
        hfData,
        currentMarketReferenceCurrencyPriceInUSD
      );

      hf = updatedWorkingData.healthFactor;
    });
  }

  let shortCircuit = false;

  // Next, uniformly decrement the asset prices until we approach the liquidation threshold.
  while (hf > HF_LIMIT && i < SHORT_CIRCUIT_LOOP_LIMIT && !shortCircuit) {
    i++;

    // Track a uniform percentage to decrement asset prices, so that the overall decrement percentage
    // for all assets will be approximately the same.
    let decrementPercentage = 0;

    assets.forEach((asset) => {
      if (hf < HF_LIMIT) return;

      const initialPrice = asset.priceInUSD;

      let priceDecrement = decrementPercentage
        ? // Use the uniform percentage, if we  have it
          Math.max(0.01, (decrementPercentage * asset.priceInUSD) / 100)
        : // Else use an approximation based on the difference between current hf and HF_LIMIT
          Math.max(
            0.01,
            Math.min(
              asset.priceInUSD * ((hf - HF_LIMIT) * 0.45),
              asset.priceInUSD * 0.5
            )
          );

      priceDecrement =
        Math.round((priceDecrement + Number.EPSILON) * 100) / 100;

      if (!decrementPercentage) {
        decrementPercentage = (priceDecrement * 100) / asset.priceInUSD;
      }

      asset.priceInUSD = Math.max(asset.priceInUSD - priceDecrement, 0.01);

      // If all asset prices needs to go below one cent in order to arrive at liquidation threshold,
      // short circuit the operation and assume there is no viable price liquidation scenario for this
      // position.
      if (asset.priceInUSD === 0.01) {
        if (!assets.find((asset) => asset.priceInUSD > 0.01)) {
          shortCircuit = true;
        }
      }

      const reserveItemAsset = hfData.userReservesData.find(
        (item) => item.asset.symbol === asset.symbol
      );

      if (reserveItemAsset)
        reserveItemAsset.asset.priceInUSD = asset.priceInUSD;

      const borrowItemAsset = hfData.userBorrowsData.find(
        (item) => item.asset.symbol === asset.symbol
      );

      if (borrowItemAsset) borrowItemAsset.asset.priceInUSD = asset.priceInUSD;

      const updatedWorkingData = updateDerivedHealthFactorData(
        hfData,
        currentMarketReferenceCurrencyPriceInUSD
      );

      if (updatedWorkingData.healthFactor < 1.0) {
        asset.priceInUSD = initialPrice;
        return;
      }

      hf = updatedWorkingData.healthFactor;
    });
  }

  if (shortCircuit || i === SHORT_CIRCUIT_LOOP_LIMIT) assets = [];

  return assets;
};

export const getIconNameFromAssetSymbol = (assetSymbol: string) => {
  return assetSymbol
    ?.toLowerCase()
    .replace(".e", "")
    .replace(".b", "")
    .replace("m.", "");
};
