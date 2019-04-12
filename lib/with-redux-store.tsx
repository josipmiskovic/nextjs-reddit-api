import React from 'react';
import { initializeStore } from '../store';
import { Store } from 'redux';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState?){
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);

  }
  return window[__NEXT_REDUX_STORE__];
}

export default App => {
  return class AppWithRedux extends React.Component {
    store

    static async getInitialProps(appContext) {
      const store = getOrCreateStore();

      // Provide some common properties to getInitialProps of pages
      appContext.ctx.store = store;
      appContext.ctx.isServer = isServer;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return { ...appProps, initialReduxState: store.getState() };
    }

    constructor(props) {
      super(props);
      this.store = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <App {...this.props} store={this.store} />;
    }
  };
};
