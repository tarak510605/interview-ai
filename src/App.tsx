import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import TabLayout from './components/Layout/TabLayout';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6 shadow-soft"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-secondary-900">Loading InterviewAI</p>
              <p className="text-sm text-secondary-600">Preparing your interview experience...</p>
            </div>
          </div>
        </div>
      } persistor={persistor}>
        <TabLayout />
      </PersistGate>
    </Provider>
  );
}

export default App;