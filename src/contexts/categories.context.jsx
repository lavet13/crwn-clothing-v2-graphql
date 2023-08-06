import { createContext, useEffect, useState } from 'react';
import { useQuery, gql, NetworkStatus } from '@apollo/client';

export const CategoriesContext = createContext({
  categoriesMap: {},
  loading: false,
  error: null,
  isPolling: false,
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
  const { loading, error, data, networkStatus, refetch } = useQuery(
    COLLECTIONS,
    {
      notifyOnNetworkStatusChange: true,
      pollInterval: 10000,
    }
  );

  const [categoriesMap, setCategoriesMap] = useState({});
  const isPolling = networkStatus === NetworkStatus.poll;
  const isRefetching = networkStatus === NetworkStatus.refetch;
  console.log('isPolling', isPolling);
  console.log('isRefetching', isRefetching);
  console.log('networkStatus', networkStatus);

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
    refetch,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
