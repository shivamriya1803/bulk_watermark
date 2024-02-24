// Route.tsx

import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import SelectFolderPage from '../View/SelectFolderPage';
import ApplyWatermarkPage from '../View/ApplyWaterMark';

const Routes: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={SelectFolderPage} />
        <Route path="/apply-watermark" component={ApplyWatermarkPage} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default Routes;
