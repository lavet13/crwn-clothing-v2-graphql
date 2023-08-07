import { useContext, useState, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, gql, NetworkStatus } from '@apollo/client';

import ProductCard from '../../components/product-card/product-card.component';

import { CategoriesContext } from '../../contexts/categories.context';

import { CategoryContainer, Title } from './category.styles';
import Spinner from '../../components/spinner/spinner.component';

const GET_CATEGORY = gql`
  query GetCollectionsByTitle($title: String) {
    getCollectionsByTitle(title: $title) {
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

const Category = () => {
  const { category } = useParams();
  // const { categoriesMap, loading, error, isPolling } =
  //   useContext(CategoriesContext);
  const { loading, error, data, networkStatus } = useQuery(GET_CATEGORY, {
    variables: { title: category },
  });

  const isPolling = networkStatus === NetworkStatus.poll;
  // const isRefetching = networkStatus === NetworkStatus.refetch;
  console.log('networkStatus', networkStatus);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      const {
        getCollectionsByTitle: { items },
      } = data;

      setProducts(items);
    }
  }, [category, data]);

  return (
    <Fragment>
      {loading && !isPolling ? (
        <Spinner />
      ) : error ? (
        <h1>Error! {error.message}</h1>
      ) : (
        <Fragment>
          <Title>{category.toUpperCase()}</Title>
          <CategoryContainer>
            {products &&
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </CategoryContainer>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Category;
