import React, {ReactElement, ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PropsWithChildren} from 'react';
import {PaperProvider} from 'react-native-paper';
import {
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
  render,
  renderHook
} from '@testing-library/react-native';
import {SelectedShowtimeContextProvider} from '../../store/selected-showtime-context';

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
    <SelectedShowtimeContextProvider>
      <PaperProvider>{children}</PaperProvider>
    </SelectedShowtimeContextProvider>
  </QueryClientProvider>
);

const HookWrapper = (
  children: ReactNode,
  queryClient?: QueryClient,
  customWrapper?: (children: ReactNode) => JSX.Element
) => (
  <QueryClientProvider client={queryClient ?? createQueryClient()}>
    {customWrapper ? customWrapper(children) : children}
  </QueryClientProvider>
);

type CustomRenderHookOptionsProps<Result> = {
  queryClient?: QueryClient;
  customWrapper?: (children: ReactNode) => JSX.Element;
  options?: Omit<RenderHookOptions<Result>, 'wrapper'>;
};

const customRenderHook = <Result, Props>(
  renderCallback: (props: Props) => Result,
  options?: CustomRenderHookOptionsProps<Props>
): RenderHookResult<Result, Props> =>
  renderHook(renderCallback, {
    wrapper: ({children}) =>
      HookWrapper(children, options?.queryClient, options?.customWrapper),
    ...options?.options
  });

// The following functions have been created following https://testing-library.com/docs/react-testing-library/setup/.

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, {wrapper: Providers, ...options});

// re-export everything
export * from '@testing-library/react-native';

// override renderHook and render method
export {customRenderHook as renderHook};
export {customRender as render};
