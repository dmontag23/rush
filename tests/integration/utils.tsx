import React, {ReactElement} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PropsWithChildren} from 'react';
import {PaperProvider} from 'react-native-paper';
import {RenderOptions, render} from '@testing-library/react-native';

// ensures a new query client is created for each test
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // ensures jest exits as soon as it has finished executing
        gcTime: Infinity,
        /* turns retries off so that tests do not timeout if you want to test
       a query that errors */
        retry: false
      },
      mutations: {
        gcTime: Infinity,
        retry: false
      }
    }
  });

const Providers = ({children}: PropsWithChildren) => (
  <QueryClientProvider client={createQueryClient()}>
    <PaperProvider>{children}</PaperProvider>
  </QueryClientProvider>
);

// The following functions have been created following https://testing-library.com/docs/react-testing-library/setup/.

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, {wrapper: Providers, ...options});

// re-export everything
export * from '@testing-library/react-native';

// override render method
export {customRender as render};
