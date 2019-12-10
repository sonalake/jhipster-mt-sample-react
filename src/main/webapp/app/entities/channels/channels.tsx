import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './channels.reducer';
import { IChannels } from 'app/shared/model/channels.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IChannelsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Channels extends React.Component<IChannelsProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { channelsList, match } = this.props;
    return (
      <div>
        <h2 id="channels-heading">
          <Translate contentKey="sampleMultitenancyAppReactApp.channels.home.title">Channels</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sampleMultitenancyAppReactApp.channels.home.createLabel">Create a new Channels</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          {channelsList && channelsList.length > 0 ? (
            <Table responsive aria-describedby="channels-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sampleMultitenancyAppReactApp.channels.name">Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sampleMultitenancyAppReactApp.channels.user">User</Translate>
                  </th>
                  <th>
                    {!this.props.account.company ? (
                      <Translate contentKey="sampleMultitenancyAppReactApp.channels.company">Company</Translate>
                    ) : (
                      ''
                    )}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {channelsList.map((channels, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${channels.id}`} color="link" size="sm">
                        {channels.id}
                      </Button>
                    </td>
                    <td>{channels.name}</td>
                    <td>
                      {channels.users
                        ? channels.users.map((val, j) => (
                            <span key={j}>
                              {val.firstName}
                              {j === channels.users.length - 1 ? '' : ', '}
                            </span>
                          ))
                        : null}
                    </td>
                    {!this.props.account.company ? (
                      <td>{channels.company ? <Link to={`company/${channels.company.id}`}>{channels.company.id}</Link> : ''}</td>
                    ) : (
                      ''
                    )}
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${channels.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${channels.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${channels.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="sampleMultitenancyAppReactApp.channels.home.notFound">No Channels found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  channelsList: storeState.channels.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels);
