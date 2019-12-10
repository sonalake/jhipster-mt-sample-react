import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IChannels, defaultValue } from 'app/shared/model/channels.model';

export const ACTION_TYPES = {
  FETCH_CHANNELS_LIST: 'channels/FETCH_CHANNELS_LIST',
  FETCH_CHANNELS: 'channels/FETCH_CHANNELS',
  CREATE_CHANNELS: 'channels/CREATE_CHANNELS',
  UPDATE_CHANNELS: 'channels/UPDATE_CHANNELS',
  DELETE_CHANNELS: 'channels/DELETE_CHANNELS',
  RESET: 'channels/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IChannels>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ChannelsState = Readonly<typeof initialState>;

// Reducer

export default (state: ChannelsState = initialState, action): ChannelsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CHANNELS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CHANNELS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CHANNELS):
    case REQUEST(ACTION_TYPES.UPDATE_CHANNELS):
    case REQUEST(ACTION_TYPES.DELETE_CHANNELS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CHANNELS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CHANNELS):
    case FAILURE(ACTION_TYPES.CREATE_CHANNELS):
    case FAILURE(ACTION_TYPES.UPDATE_CHANNELS):
    case FAILURE(ACTION_TYPES.DELETE_CHANNELS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHANNELS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHANNELS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CHANNELS):
    case SUCCESS(ACTION_TYPES.UPDATE_CHANNELS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CHANNELS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/channels';

// Actions

export const getEntities: ICrudGetAllAction<IChannels> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CHANNELS_LIST,
  payload: axios.get<IChannels>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IChannels> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CHANNELS,
    payload: axios.get<IChannels>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IChannels> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CHANNELS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IChannels> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CHANNELS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IChannels> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CHANNELS,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
