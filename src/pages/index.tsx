import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Box, Button } from '@chakra-ui/react';

import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';

type IDataRequestProps = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

interface IRequest {
  data: Array<IDataRequestProps>;
  after: string;
}

export default function Home(): JSX.Element {
  const getImages = async ({ pageParam = 0 }): Promise<IRequest> => {
    const response = await api.get(`/api/images`, {
      params: {
        after: pageParam,
      },
    });
    return response.data;
  };

  const presetData = {
    "pages": [
      {
        "data": [
          {
            "title": "Doge",
            "description": "The best doge",
            "url": "https://i.ibb.co/K6DZdXc/minh-pham-LTQMgx8t-Yq-M-unsplash.jpg",
            "ts": 1620222828340000,
            "id": "294961059684418048"
          },
          {
            "title": "Cachorrinho gif",
            "description": "A Gracie é top",
            "url": "https://i.ibb.co/r3NbmgH/ezgif-3-54a30c130cef.gif",
            "ts": 1620222856980000,
            "id": "295991055792210435"
          },
          {
            "title": "React",
            "description": "Dan Abramov",
            "url": "https://i.ibb.co/864qfG3/react.png",
            "ts": 1620223108460000,
            "id": "295991069654385154"
          },
          {
            "title": "Ignite",
            "description": "Wallpaper Celular",
            "url": "https://i.ibb.co/DbfGQW5/1080x1920.png",
            "ts": 1620223119610000,
            "id": "295991085899973123"
          },
          {
            "title": "Ignite",
            "description": "Wallpaper PC 4k",
            "url": "https://i.ibb.co/fvYLKFn/3840x2160.png",
            "ts": 1620223133800000,
            "id": "295991107279389188"
          },
          {
            "title": "Paisagem",
            "description": "Sunset",
            "url": "https://i.ibb.co/st42sNz/petr-vysohlid-9fqw-Gq-GLUxc-unsplash.jpg",
            "ts": 1620223149390000,
            "id": "295991128736399874"
          }
        ],
        "after": "295991160078336512"
      }
    ],
    "pageParams": [
      null
    ]
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    getImages,
    {
      getNextPageParam: result => {
        const { after } = result;
        if (after) {
          return after;
        }
        return null;
      },
    }
  );

  const formattedData = useMemo(() => {
    if (data) {
      // return presetData.pages.map(page => page.data).flat?
      return data.pages.map(page => page.data).flat(2);
    }

    return null;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="32px" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}