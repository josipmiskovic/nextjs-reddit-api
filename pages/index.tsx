import React from 'react';
import {connect} from 'react-redux'
import { Action, Dispatch } from 'redux';
import Picker from '../components/Picker';
import Post, { PostData } from '../components/Post';
import { changeSubreddit, performSearch } from '../store';


interface Props {
  errorMessage: string;
  posts: PostData[];
  lastFetch: number;
  isFetching: boolean;
  currentSubreddit: string;
  performSearch: (subreddit: string, force: boolean) => Dispatch;
  changeSubreddit: (subreddit: string) => Dispatch;
}

interface State {
  currentSubreddit: string;
  postsBySubreddit: { [key: string]: { posts: PostData[], isFetching: boolean, lastFetch: number } } ;
  errorMessage: string;
}


class Index extends React.Component<Props, State> {

  handleChange = (nextSubreddit: string)  => {
    this.props.changeSubreddit(nextSubreddit);
    this.props.performSearch(nextSubreddit, false);
  }

  handleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();
    const { currentSubreddit } = this.props;
    this.props.performSearch(currentSubreddit, true);
  }


  componentDidMount = () => {
    const { performSearch, currentSubreddit } = this.props;
    performSearch(currentSubreddit, false);
  }
  render = () => {


    const { currentSubreddit, posts, isFetching, lastFetch, errorMessage } = this.props;

    return( 
      <div>
        <Picker
          value={currentSubreddit}
          onChange={this.handleChange}
          options={['reactjs', 'frontend']}
        />

        <button onClick={e => this.handleButton(e)}> Force update </button>

        <br/><br/>

        { errorMessage && 
          <h3>{ errorMessage }</h3>
        }

        { isFetching && 
          <h3>Loading...</h3>
        }

        { !isFetching && 
          <div>
            { lastFetch && 
            
              <span> Last fetch: {  lastFetch.toString() } </span>
            }

            { posts.map((post) => <Post data={ post }/> ) 
            }
            
          </div>
        }
      </div>
    );
  };
}

const mapStateToProps = (state: State) => {

    const { currentSubreddit, postsBySubreddit, errorMessage } = state;
    const { posts, isFetching, lastFetch } = postsBySubreddit[currentSubreddit] || { posts:[], isFetching: true, lastFetch: 0};



    return(
      { 
        currentSubreddit,
        posts,
        isFetching,
        lastFetch,
        errorMessage
      }
    );
}

const mapDispatchToProps = (dispatch) => ({
  changeSubreddit: (subreddit: string): Dispatch<Action> => dispatch(changeSubreddit(subreddit)),
  performSearch: (subreddit: string, force:boolean) => dispatch(performSearch(subreddit, force)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Index)