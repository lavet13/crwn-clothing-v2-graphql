import { createContext, useEffect, useState } from 'react';
import { useQuery, gql, NetworkStatus, useLazyQuery } from '@apollo/client';

export const CategoriesContext = createContext({
  categoriesMap: {},
  loading: false,
  error: null,
  isPolling: false,
  getCollections: () => undefined,
  refetch: () => undefined,
});

export const COLLECTIONS = gql`
  query {
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

export const CategoriesProvider = ({ children }) => {
  const [getCollections, { loading, error, data, networkStatus, refetch }] =
    useLazyQuery(COLLECTIONS, {
      notifyOnNetworkStatusChange: true,
      pollInterval: 10000,
    });

  const [categoriesMap, setCategoriesMap] = useState({});
  const isPolling = networkStatus === NetworkStatus.poll;
  console.log('isPolling', isPolling);
  console.log(networkStatus);

  useEffect(() => {
    if (data) {
      const { collections } = data;
      const collectionsMap = collections.reduce((acc, collection) => {
        // return { ...acc, [collection.title]: collection.items };
        acc[collection.title?.toLowerCase()] = collection.items;
        return acc;
      }, {});

      setCategoriesMap(collectionsMap);
    }
  }, [data]);

  const value = {
    categoriesMap,
    loading,
    error,
    isPolling,
    getCollections,
    refetch,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
