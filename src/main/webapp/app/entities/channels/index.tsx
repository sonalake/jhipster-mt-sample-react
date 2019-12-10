import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Channels from './channels';
import ChannelsDetail from './channels-detail';
import ChannelsUpdate from './channels-update';
import ChannelsDeleteDialog from './channels-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ChannelsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ChannelsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ChannelsDetail} />
      <ErrorBoundaryRoute path={match.url} component={Channels} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ChannelsDeleteDialog} />
  </>
);

export default Routes;
