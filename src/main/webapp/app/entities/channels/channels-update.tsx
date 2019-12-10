import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ICompany } from 'app/shared/model/company.model';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntity, updateEntity, createEntity, reset } from './channels.reducer';
import { IChannels } from 'app/shared/model/channels.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IChannelsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IChannelsUpdateState {
  isNew: boolean;
  idsuser: any[];
  companyId: string;
}

export class ChannelsUpdate extends React.Component<IChannelsUpdateProps, IChannelsUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idsuser: [],
      companyId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getUsers();

    if (!this.props.account.company) {
      this.props.getCompanies();
    }
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { channelsEntity } = this.props;
      const company = this.props.account.company;
      const entity = {
        ...channelsEntity,
        company,
        ...values,
        users: mapIdList(values.users)
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/channels');
  };

  render() {
    const { channelsEntity, users, companies, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sampleMultitenancyAppReactApp.channels.home.createOrEditLabel">
              <Translate contentKey="sampleMultitenancyAppReactApp.channels.home.createOrEditLabel">Create or edit a Channels</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : channelsEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="channels-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="channels-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="channels-name">
                    <Translate contentKey="sampleMultitenancyAppReactApp.channels.name">Name</Translate>
                  </Label>
                  <AvField id="channels-name" type="text" name="name" />
                </AvGroup>
                <AvGroup>
                  <Label for="channels-user">
                    <Translate contentKey="sampleMultitenancyAppReactApp.channels.user">User</Translate>
                  </Label>
                  <AvInput
                    id="channels-user"
                    type="select"
                    multiple
                    className="form-control"
                    name="users"
                    value={channelsEntity.users && channelsEntity.users.map(e => e.id)}
                  >
                    <option value="" key="0" />
                    {users
                      ? users.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.firstName}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  {!this.props.account.company ? (
                    <Label for="channels-company">
                      <Translate contentKey="sampleMultitenancyAppReactApp.channels.company">Company</Translate>
                    </Label>
                  ) : (
                    ''
                  )}
                  {!this.props.account.company ? (
                    <AvInput
                      id="channels-company"
                      type="select"
                      className="form-control"
                      name="company.id"
                      value={isNew ? companies[0] && companies[0].id : channelsEntity.company && channelsEntity.company.id}
                      required
                    >
                      {companies
                        ? companies.map(otherEntity => (
                            <option value={otherEntity.id} key={otherEntity.id}>
                              {otherEntity.id}
                            </option>
                          ))
                        : null}
                    </AvInput>
                  ) : (
                    ''
                  )}
                  <AvFeedback>
                    <Translate contentKey="entity.validation.required">This field is required.</Translate>
                  </AvFeedback>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/channels" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  companies: storeState.company.entities,
  account: storeState.authentication.account,
  channelsEntity: storeState.channels.entity,
  loading: storeState.channels.loading,
  updating: storeState.channels.updating,
  updateSuccess: storeState.channels.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getCompanies,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelsUpdate);
