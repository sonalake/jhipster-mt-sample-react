import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './channels.reducer';
import { IChannels } from 'app/shared/model/channels.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IChannelsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ChannelsDetail extends React.Component<IChannelsDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { channelsEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sampleMultitenancyAppReactApp.channels.detail.title">Channels</Translate> [<b>{channelsEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="sampleMultitenancyAppReactApp.channels.name">Name</Translate>
              </span>
            </dt>
            <dd>{channelsEntity.name}</dd>
            <dt>
              <Translate contentKey="sampleMultitenancyAppReactApp.channels.user">User</Translate>
            </dt>
            <dd>
              {channelsEntity.users
                ? channelsEntity.users.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.firstName}</a>
                      {i === channelsEntity.users.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}{' '}
            </dd>
            <dt>
              {!this.props.account.company ? (
                <Translate contentKey="sampleMultitenancyAppReactApp.channels.company">Company</Translate>
              ) : (
                ''
              )}
            </dt>
            <dd>{channelsEntity.company ? channelsEntity.company.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/channels" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/channels/${channelsEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  channelsEntity: storeState.channels.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelsDetail);
