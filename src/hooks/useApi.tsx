import { selectToken } from '../reducers/user';
import { useAppSelector } from './redux';

function useApi() {
  const token = useAppSelector(selectToken);

  return token;
}

export default useApi;
