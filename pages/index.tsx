import React from 'react';
import {connect} from 'react-redux'
import { Action, Dispatch } from 'redux';
import Picker from '../components/Picker';
import { changeSubreddit, performSearch } from '../store';

class Index extends React.Component {

  handleChange = (nextSubreddit)  => {
    this.props.changeSubreddit(nextSubreddit);
    this.props.performSearch(nextSubreddit, false);
  }

  handleButton = (e)  => {
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

        { errorMessage && 
          <h3>{ errorMessage }</h3>
        }

        { isFetching && 
          <span>Loading...</span>
        }

        { !isFetching && 
          <div>
            { lastFetch && 
            
              <span> Last fetch: {  lastFetch.toString() } </span>
            }

            <p>{ posts.map((post, i) => 
                  post.title
              ) }
            </p>
          </div>
        }
      </div>
    );
  };
}

const mapStateToProps = (state) => {

    const { currentSubreddit, subreddits, postsBySubreddit, errorMessage } = state;
    const { posts, isFetching, lastFetch } = postsBySubreddit[currentSubreddit] || { posts:[], isFetching: true, lastFetch: 0};



    return(
      { 
        subreddits,
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