import { selectToken } from '../features/user';
import { useAppSelector } from '../utils/hooks';

function useApi() {
  const token = useAppSelector(selectToken);

  return token;
}

export default useApi;
