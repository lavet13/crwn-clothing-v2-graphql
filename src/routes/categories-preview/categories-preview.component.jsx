import { useContext, Fragment } from 'react';

import { CategoriesContext } from '../../contexts/categories.context';
import CategoryPreview from '../../components/category-preview/category-preview.component';
import Spinner from '../../components/spinner/spinner.component';
import Button, {
  BUTTON_TYPE_CLASSES,
} from '../../components/button/button.component';

const CategoriesPreview = () => {
  const { categoriesMap, loading, error, isPolling, getCollections, refetch } =
    useContext(CategoriesContext);

  return (
    <Fragment>
      <Button
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        onClick={() => getCollections()}
      >
        Fetch Collections
      </Button>
      <Button
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        onClick={() => refetch()}
      >
        Refetch Collections
      </Button>
      {loading && !isPolling ? (
        <Spinner />
      ) : error ? (
        <h1>Some kind of error {error.message}</h1>
      ) : (
        Object.keys(categoriesMap).map(title => {
          const products = categoriesMap[title];
          return (
            <CategoryPreview key={title} title={title} products={products} />
          );
        })
      )}
    </Fragment>
  );
};

export default CategoriesPreview;
