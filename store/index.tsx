import { createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';


export const actionTypes = {

    CHANGE_SUBREDDIT: "CHANGE_SUBREDDIT",
    START_FETCHING: "START_FETCHING",
    FINISH_FETCHING: "FINISH_FETCHING",
    RECEIVE_POSTS: "RECEIVE_POSTS",
    SEND_ERROR: "SEND_ERROR"

}

const initState = {
    currentSubreddit: "reactjs",
    subreddits: {
      "reactjs":
      {
        posts: [
          {
            title: "Lito ide",
            url: "https://google.com"
          }
        ],
        lastFetch:new Date(),
        isFetching: false,
      }
    },
}



//ACTIONS

export const changeSubreddit = (currentSubreddit: string) => ({
  type: actionTypes.CHANGE_SUBREDDIT,
  currentSubreddit
})

export const startFetching = (subreddit: string) => ({
  type: actionTypes.START_FETCHING,
  isFetching: true,
  subreddit,
  error: ""
})

export const receivePosts = (subreddit: string, json) => ({
  type: actionTypes.RECEIVE_POSTS,
  subreddit,
  isFetching: false,
  posts: json.data.children.map(child => child.data),
  lastFetch: new Date()
})

export const sendError = (message: string) =>  (
{
  type: actionTypes.SEND_ERROR,
  message
})

export const isFetchingNeeded = (state, subredditName: string, force: boolean) => {

  const selectedSubreddit =  state.postsBySubreddit[subredditName];
  console.log(selectedSubreddit);

  if(!selectedSubreddit)
    return true;


  if(selectedSubreddit.isFetching)
    return false;

  if(!selectedSubreddit || force)
    return true;
  else
    return false;
}

export const fetchPosts = (subreddit: string) => async dispatch => {
  dispatch(startFetching(subreddit));
  try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
      if(response.ok) {
          const json = await response.json();
          return dispatch(receivePosts(subreddit, json));
      }
      else {
          return dispatch(sendError(response.status.toString()));
      }
      
  } catch (err) {
      return dispatch(sendError(err.message));
  }
}



export const performSearch = (subreddit: string, force: boolean) => (dispatch, getState) => {
  if(isFetchingNeeded(getState(), subreddit, force)){
    return dispatch(fetchPosts(subreddit));
  }
}


// REDUCERS
export const reducer = (state = initState.currentSubreddit, action) => {
  switch (action.type) {
    default: 
      return state
    case actionTypes.CHANGE_SUBREDDIT: 
      return action.currentSubreddit
    
  }
}

export const postReducer = ( state = { isFetching: true, posts: [], lastFetch: 0 }, action) => {
  switch (action.type) {
    default: 
      return state
    case actionTypes.SEND_ERROR:
    case actionTypes.RECEIVE_POSTS: 
      return {
        ...state,
        posts: action.posts,
        lastFetch: action.lastFetch,
        isFetching: action.isFetching
      }
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case actionTypes.RECEIVE_POSTS:
    case actionTypes.START_FETCHING: 
    case actionTypes.CHANGE_SUBREDDIT:
      return { ...state,
          [action.subreddit]: postReducer(state[action.subreddit], action)
        }
    default:
      return state
  }
}

const errorMessage = (state = "", action) =>  {
  switch (action.type) {
    case actionTypes.SEND_ERROR:
      return action.message
    default:
      return state
  }
}


const middleware = [ thunk ]


const rootReducer = combineReducers({currentSubreddit: reducer, postsBySubreddit, errorMessage});

export function initializeStore (initialState = initState) {
  return createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))
}