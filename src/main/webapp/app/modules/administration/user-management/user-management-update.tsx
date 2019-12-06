import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Label, Row, Col } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { locales, languages } from 'app/config/translation';
import { getUser, getRoles, updateUser, createUser, reset } from './user-management.reducer';
import { getEntities as getCompanies } from '../../../entities/company/company.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IUserManagementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export interface IUserManagementUpdateState {
  isNew: boolean;
  companyId: string;
}
export class UserManagementUpdate extends React.Component<IUserManagementUpdateProps, IUserManagementUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '0',
      isNew: !props.match.params || !props.match.params.login
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
      this.props.getUser(this.props.match.params.login);
    }
    this.props.getRoles();
    this.props.getCompanies();
  }

  saveUser = (event, values) => {
    const { User } = this.props;
    const entity = {
      ...User,
      ...values
    };

    if (this.state.isNew) {
      this.props.createUser(entity);
    } else {
      this.props.updateUser(entity);
    }
  };

  handleClose = () => {
    this.props.history.push('/admin/user-management');
  };

  render() {
    const { isNew } = this.state;
    const { User, companies, loading, updating, roles } = this.props;
    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h1>
              <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
            </h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : User} onValidSubmit={this.saveUser}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvField type="text" className="form-control" name="id" required readOnly value={User.id} />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label for="login">
                    <Translate contentKey="userManagement.login">Login</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="login"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('register.messages.validate.login.required')
                      },
                      pattern: {
                        value: '^[_.@A-Za-z0-9-]*$',
                        errorMessage: translate('register.messages.validate.login.pattern')
                      },
                      minLength: {
                        value: 1,
                        errorMessage: translate('register.messages.validate.login.minlength')
                      },
                      maxLength: {
                        value: 50,
                        errorMessage: translate('register.messages.validate.login.maxlength')
                      }
                    }}
                    value={User.login}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="firstName">
                    <Translate contentKey="userManagement.firstName">First Name</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="firstName"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: translate('entity.validation.maxlength', { max: 50 })
                      }
                    }}
                    value={User.firstName}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="lastName">
                    <Translate contentKey="userManagement.lastName">Last Name</Translate>
                  </Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="lastName"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: translate('entity.validation.maxlength', { max: 50 })
                      }
                    }}
                    value={User.lastName}
                  />
                  <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
                </AvGroup>
                <AvGroup>
                  <AvField
                    name="email"
                    label={translate('global.form.email.label')}
                    placeholder={translate('global.form.email.placeholder')}
                    type="email"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: translate('global.messages.validate.email.required')
                      },
                      email: {
                        errorMessage: translate('global.messages.validate.email.invalid')
                      },
                      minLength: {
                        value: 5,
                        errorMessage: translate('global.messages.validate.email.minlength')
                      },
                      maxLength: {
                        value: 254,
                        errorMessage: translate('global.messages.validate.email.maxlength')
                      }
                    }}
                    value={User.email}
                  />
                </AvGroup>
                <AvGroup check>
                  <Label>
                    <AvInput type="checkbox" name="activated" value={User.activated} />{' '}
                    <Translate contentKey="userManagement.activated">Activated</Translate>
                  </Label>
                </AvGroup>
                <AvGroup>
                  <Label for="langKey">
                    <Translate contentKey="userManagement.langKey">Language Key</Translate>
                  </Label>
                  {User.langKey ? (
                    <AvField type="select" className="form-control" name="langKey" value={User.langKey}>
                      {locales.map(locale => (
                        <option value={locale} key={locale}>
                          {languages[locale].name}
                        </option>
                      ))}
                    </AvField>
                  ) : (
                    <AvField type="select" className="form-control" name="langKey" value={locales[0]}>
                      {locales.map(locale => (
                        <option value={locale} key={locale}>
                          {languages[locale].name}
                        </option>
                      ))}
                    </AvField>
                  )}
                </AvGroup>
                <AvGroup>
                  <Label for="company">
                    <Translate contentKey="sampleMultitenancyAppReactApp.company.detail.title">Company</Translate>
                  </Label>
                  {User.company ? (
                    <AvInput id="user-company" type="select" className="form-control" name="company.id" value={User.company.id}>
                      <option value="" key="0" />
                      {companies
                        ? companies.map(company => (
                            <option value={company.id} key={company.id}>
                              {company.id}
                            </option>
                          ))
                        : null}
                    </AvInput>
                  ) : (
                    <AvInput id="user-company" type="select" className="form-control" name="company.id">
                      <option value="" key="0" />
                      {companies
                        ? companies.map(company => (
                            <option value={company.id} key={company.id}>
                              {company.id}
                            </option>
                          ))
                        : null}
                    </AvInput>
                  )}
                </AvGroup>
                <AvGroup>
                  <Label for="authorities">
                    <Translate contentKey="userManagement.profiles">Language Key</Translate>
                  </Label>
                  <AvInput type="select" className="form-control" name="authorities" value={User.authorities} multiple>
                    {roles.map(role => (
                      <option value={role} key={role}>
                        {role}
                      </option>
                    ))}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} to="/admin/user-management" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-user" type="submit" disabled={updating}>
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
  User: storeState.userManagement.user,
  roles: storeState.userManagement.authorities,
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating,
  updateSuccess: storeState.userManagement.updateSuccess,
  companies: storeState.company.entities
});

const mapDispatchToProps = { getCompanies, getUser, getRoles, updateUser, createUser, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagementUpdate);
